// src/contexts/CartContext.tsx - UPDATED VERSION
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext'; // Now this should work

interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  variantTitle?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  stock: number;
  isLocal?: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => number;
  getCartTotal: () => number;
  syncCartWithDatabase: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth(); // Now this should work since CartProvider is within AuthProvider
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial cart based on user
  useEffect(() => {
    const initializeCart = async () => {
      try {
        console.log("Initializing cart for user:", user?.email || 'guest');
        
        if (user) {
          // Load from Supabase for logged-in user
          await loadFromSupabase(user.id);
        } else {
          // Load from localStorage for guest
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              console.log("Loaded guest cart from localStorage:", parsedCart.length, "items");
              setCartItems(parsedCart);
            } catch (e) {
              console.error("Error parsing localStorage cart:", e);
              localStorage.removeItem('cart');
              setCartItems([]);
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        // Fallback to localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        } else {
          setCartItems([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [user]);

  const loadFromSupabase = async (userId: string) => {
    try {
      console.log("Loading cart from Supabase for user:", userId);
      
      // Get or create cart
      let { data: cart, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (cartError) {
        console.error("Error fetching cart:", cartError);
        throw cartError;
      }

      if (!cart) {
        console.log("No active cart found, creating new one...");
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert({ user_id: userId })
          .select()
          .single();
        
        if (createError) {
          console.error("Error creating cart:", createError);
          throw createError;
        }
        cart = newCart;
      }

      console.log("Cart ID:", cart.id);

      // Load cart items
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          variant_id,
          quantity,
          product:products (
            name,
            collections (title)
          ),
          variant:product_variants (
            price,
            image_url,
            stock,
            title
          )
        `)
        .eq('cart_id', cart.id);

      if (itemsError) {
        console.error("Error fetching cart items:", itemsError);
        throw itemsError;
      }

      console.log("Cart items from Supabase:", items);

      if (items && items.length > 0) {
        const transformedItems: CartItem[] = items.map(item => ({
          id: item.id,
          productId: item.product_id,
          variantId: item.variant_id,
          name: `${item.product?.name || 'Product'} ${item.variant?.title ? `- ${item.variant.title}` : ''}`.trim(),
          price: item.variant?.price || 0,
          image: item.variant?.image_url || '/placeholder.jpg',
          category: item.product?.collections?.title || 'Uncategorized',
          quantity: item.quantity,
          stock: item.variant?.stock || 99
        }));

        console.log("Transformed cart items:", transformedItems);
        setCartItems(transformedItems);
        
        // Clear localStorage when loading from Supabase
        localStorage.setItem('cart', JSON.stringify([]));
      } else {
        console.log("No items in Supabase cart");
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      // Fallback to localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        console.log("Falling back to localStorage cart");
        setCartItems(JSON.parse(savedCart));
      }
      throw error;
    }
  };

  const syncCartWithSupabase = async (userId: string) => {
    try {
      console.log("Syncing cart with Supabase for user:", userId);
      
      // Get localStorage cart
      const savedCart = localStorage.getItem('cart');
      const localCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
      
      console.log("Local cart items to sync:", localCart.length);

      if (localCart.length === 0) {
        // No local items, just load from Supabase
        await loadFromSupabase(userId);
        return;
      }

      // Get or create Supabase cart
      let { data: cart } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ user_id: userId })
          .select()
          .single();
        cart = newCart;
      }

      // Merge each local item
      for (const localItem of localCart) {
        // Check if item exists in Supabase
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_id', cart.id)
          .eq('variant_id', localItem.variantId)
          .maybeSingle();

        if (existingItem) {
          // Update quantity (add local quantity to existing)
          await supabase
            .from('cart_items')
            .update({ 
              quantity: Math.min(
                existingItem.quantity + localItem.quantity, 
                localItem.stock || 99
              )
            })
            .eq('id', existingItem.id);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({
              cart_id: cart.id,
              product_id: localItem.productId,
              variant_id: localItem.variantId,
              quantity: Math.min(localItem.quantity, localItem.stock || 99)
            });
        }
      }

      // Clear localStorage after successful sync
      localStorage.removeItem('cart');
      
      // Now load the merged cart from Supabase
      await loadFromSupabase(userId);
      
      console.log("Cart sync completed successfully");
      
    } catch (error) {
      console.error('Error syncing cart:', error);
      // On error, keep localStorage intact for retry
    }
  };

  const syncCartWithDatabase = async () => {
    if (user) {
      await syncCartWithSupabase(user.id);
    }
  };

  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    try {
      console.log("Adding to cart:", item);
      
      if (user) {
        // Add to Supabase for logged-in user
        let { data: cart } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (!cart) {
          const { data: newCart } = await supabase
            .from('carts')
            .insert({ user_id: user.id })
            .select()
            .single();
          cart = newCart;
        }

        // Check if item exists
        const { data: existingItem } = await supabase
          .from('cart_items')
          .select('*')
          .eq('cart_id', cart.id)
          .eq('variant_id', item.variantId)
          .maybeSingle();

        if (existingItem) {
          // Update quantity
          const newQuantity = Math.min(
            existingItem.quantity + item.quantity,
            item.stock || 99
          );
          
          await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.id);
          
          // Update local state
          const updatedItems = cartItems.map(ci => 
            ci.variantId === item.variantId 
              ? { ...ci, quantity: newQuantity }
              : ci
          );
          setCartItems(updatedItems);
          
        } else {
          // Insert new item
          const { data: newItem, error: insertError } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cart.id,
              product_id: item.productId,
              variant_id: item.variantId,
              quantity: Math.min(item.quantity, item.stock || 99)
            })
            .select()
            .single();
            
          if (insertError) throw insertError;
          
          const cartItem = { ...item, id: newItem.id };
          setCartItems(prev => [...prev, cartItem]);
        }
      } else {
        // Add to localStorage for guest
        const existingIndex = cartItems.findIndex(ci => ci.variantId === item.variantId);
        
        if (existingIndex >= 0) {
          // Update existing item
          const updatedItems = [...cartItems];
          const newQuantity = Math.min(
            updatedItems[existingIndex].quantity + item.quantity,
            item.stock || 99
          );
          updatedItems[existingIndex].quantity = newQuantity;
          setCartItems(updatedItems);
          localStorage.setItem('cart', JSON.stringify(updatedItems));
        } else {
          // Add new item
          const newItemId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const cartItem = { ...item, id: newItemId, isLocal: true };
          const updatedItems = [...cartItems, cartItem];
          setCartItems(updatedItems);
          localStorage.setItem('cart', JSON.stringify(updatedItems));
        }
      }

      toast.success(`${item.name} added to cart!`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      if (user && !id.startsWith('local_')) {
        // Remove from Supabase
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', id);
      }

      // Update local state
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      
      if (!user) {
        localStorage.setItem('cart', JSON.stringify(updatedItems));
      }

      toast.success('Item removed from cart');
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(id);
      return;
    }

    try {
      const item = cartItems.find(item => item.id === id);
      if (!item) return;

      // Check stock
      const newQuantity = Math.min(quantity, item.stock || 99);

      if (user && !id.startsWith('local_')) {
        // Update in Supabase
        await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', id);
      }

      // Update local state
      const updatedItems = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
      
      if (!user) {
        localStorage.setItem('cart', JSON.stringify(updatedItems));
      }

      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        let { data: cart } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        if (cart) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cart.id);
        }
      }

      localStorage.removeItem('cart');
      setCartItems([]);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    syncCartWithDatabase,
    isLoading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
