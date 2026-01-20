import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Clock, Users, ChefHat, Search, Filter, Heart, Star, Flame, Share2, Leaf, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Enhanced recipes data with full details
const recipes = [
  {
    id: 1,
    title: "Mango Lassi",
    description: "Refreshing yogurt-based drink with ripe mangoes and cardamom",
    time: "10 min",
    servings: 2,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800&h=600&fit=crop&q=80",
    category: "Beverage",
    rating: 4.9,
    favorites: 167,
    ingredients: [
      "2 ripe mangoes, peeled and chopped",
      "2 cups plain yogurt",
      "1/2 cup milk or water",
      "2-3 tablespoons honey or sugar",
      "1/2 teaspoon cardamom powder",
      "Ice cubes",
      "Mint leaves for garnish"
    ],
    steps: [
      "Peel and chop the mangoes into chunks",
      "In a blender, combine mangoes, yogurt, milk, and honey",
      "Add cardamom powder and blend until smooth",
      "Taste and adjust sweetness if needed",
      "Add ice cubes and blend briefly",
      "Pour into glasses, garnish with mint",
      "Serve chilled immediately"
    ],
    tips: [
      "Use ripe, sweet mangoes for best flavor",
      "For vegan version, use coconut yogurt",
      "Add a pinch of saffron for extra richness",
      "Chill glasses before serving"
    ],
    tags: ["Refreshing", "Summer", "Dairy"],
    color: "from-amber-400 to-yellow-500",
    calories: 180
  },
  {
    id: 2,
    title: "Masala Papaya Salad",
    description: "Spicy salad with ripe papaya, chaat masala, and fresh herbs",
    time: "15 min",
    servings: 2,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&q=80",
    category: "Salad",
    rating: 4.6,
    favorites: 98,
    ingredients: [
      "1 medium ripe papaya, peeled and cubed",
      "1 cucumber, diced",
      "1 red onion, thinly sliced",
      "1 green chili, finely chopped",
      "1/4 cup fresh cilantro, chopped",
      "2 tablespoons lemon juice",
      "1 teaspoon chaat masala",
      "1/2 teaspoon roasted cumin powder",
      "Salt to taste",
      "Pomegranate seeds for garnish"
    ],
    steps: [
      "Prepare all vegetables - cube papaya, dice cucumber, slice onion",
      "In a large bowl, combine papaya, cucumber, and onion",
      "Add green chili and cilantro",
      "In a small bowl, mix lemon juice, chaat masala, cumin powder, and salt",
      "Pour dressing over salad and toss gently",
      "Let it marinate for 5 minutes",
      "Garnish with pomegranate seeds",
      "Serve immediately"
    ],
    tips: [
      "Use slightly firm papaya for better texture",
      "Adjust chili according to your spice preference",
      "Add roasted peanuts for crunch",
      "Best served fresh, don't make ahead"
    ],
    tags: ["Spicy", "Tropical", "Quick"],
    color: "from-orange-400 to-red-400",
    calories: 120
  },
  {
    id: 3,
    title: "Jackfruit Biryani",
    description: "Aromatic rice dish with young jackfruit and whole spices",
    time: "60 min",
    servings: 4,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop&q=80",
    category: "Main",
    rating: 4.8,
    favorites: 212,
    ingredients: [
      "2 cups basmati rice, soaked for 30 minutes",
      "500g young jackfruit, chopped",
      "2 large onions, thinly sliced",
      "2 tomatoes, chopped",
      "1/2 cup yogurt",
      "2 tablespoons ginger-garlic paste",
      "1 teaspoon turmeric powder",
      "2 teaspoons biryani masala",
      "Whole spices (2 bay leaves, 4 cloves, 2 cinnamon sticks, 4 cardamom)",
      "1/4 cup mint leaves",
      "1/4 cup cilantro",
      "Saffron milk (few saffron strands soaked in 2 tbsp warm milk)",
      "4 tablespoons ghee or oil",
      "Salt to taste"
    ],
    steps: [
      "Cook rice with whole spices until 70% done, drain",
      "Marinate jackfruit with yogurt, turmeric, and salt for 15 minutes",
      "In a heavy-bottomed pan, fry onions until golden brown",
      "Add ginger-garlic paste, sauté until fragrant",
      "Add tomatoes and cook until soft",
      "Add marinated jackfruit, biryani masala, and cook for 10 minutes",
      "Layer cooked rice over jackfruit mixture",
      "Sprinkle mint, cilantro, and saffron milk",
      "Cover and cook on low heat for 20 minutes",
      "Let it rest for 10 minutes before serving"
    ],
    tips: [
      "Use canned young jackfruit for convenience",
      "Soak saffron in warm milk for better color release",
      "Don't skip the resting time - it allows flavors to meld",
      "Serve with raita and pickle"
    ],
    tags: ["Festive", "Spicy", "Rice"],
    color: "from-emerald-500 to-teal-600",
    calories: 420
  },
  {
    id: 4,
    title: "Stuffed Bell Peppers",
    description: "Bell peppers filled with spiced potatoes and paneer",
    time: "45 min",
    servings: 4,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800&h=600&fit=crop&q=80",
    category: "Main",
    rating: 4.7,
    favorites: 145,
    ingredients: [
      "4 large bell peppers (mixed colors)",
      "2 medium potatoes, boiled and mashed",
      "200g paneer, crumbled",
      "1 onion, finely chopped",
      "1 teaspoon ginger-garlic paste",
      "1 teaspoon garam masala",
      "1/2 teaspoon turmeric powder",
      "1/2 teaspoon red chili powder",
      "2 tablespoons oil",
      "Salt to taste",
      "Fresh coriander for garnish",
      "Grated cheese for topping (optional)"
    ],
    steps: [
      "Cut the tops off bell peppers and remove seeds",
      "Heat oil, sauté onions until golden",
      "Add ginger-garlic paste and spices, cook for 2 minutes",
      "Add mashed potatoes and crumbled paneer, mix well",
      "Stuff the mixture into bell peppers",
      "Arrange in baking dish, add 1/2 cup water",
      "Bake at 180°C for 25-30 minutes",
      "Garnish with fresh coriander and serve hot"
    ],
    tips: [
      "Choose firm, symmetrical bell peppers for even cooking",
      "Parboil bell peppers for 3 minutes for faster baking",
      "Add raisins or cashews for extra texture",
      "Can be air-fried for crispier texture"
    ],
    tags: ["Stuffed", "Colorful", "Baked"],
    color: "from-red-400 to-orange-500",
    calories: 280
  },
  {
    id: 5,
    title: "Watermelon Feta Salad",
    description: "Sweet watermelon with salty feta and mint dressing",
    time: "15 min",
    servings: 2,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1625943917485-df256bc1368b?w=800&h=600&fit=crop&q=80",
    category: "Salad",
    rating: 4.5,
    favorites: 123,
    ingredients: [
      "4 cups watermelon, cubed",
      "200g feta cheese, crumbled",
      "1/4 cup fresh mint leaves",
      "1/4 cup fresh basil leaves",
      "2 tablespoons extra virgin olive oil",
      "1 tablespoon lemon juice",
      "1 teaspoon honey",
      "Salt and black pepper to taste",
      "1/4 cup toasted pumpkin seeds"
    ],
    steps: [
      "Cube watermelon and crumble feta cheese",
      "Chop mint and basil leaves",
      "In a small bowl, whisk olive oil, lemon juice, honey, salt and pepper",
      "In a large bowl, gently toss watermelon with half the dressing",
      "Add feta cheese and fresh herbs",
      "Drizzle remaining dressing and toss gently",
      "Sprinkle toasted pumpkin seeds on top",
      "Serve immediately"
    ],
    tips: [
      "Use seedless watermelon for convenience",
      "Toast pumpkin seeds for extra flavor",
      "Add arugula for peppery notes",
      "Don't dress salad too early to prevent sogginess"
    ],
    tags: ["Sweet", "Savory", "Quick"],
    color: "from-pink-400 to-rose-500",
    calories: 210
  },
  {
    id: 6,
    title: "Banana Flower Curry",
    description: "Traditional South Indian curry with banana flower and coconut",
    time: "50 min",
    servings: 4,
    difficulty: "Difficult",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80",
    category: "Main",
    rating: 4.9,
    favorites: 178,
    ingredients: [
      "1 banana flower, cleaned and chopped",
      "1 cup grated coconut",
      "1 teaspoon turmeric powder",
      "2 teaspoons sambar powder",
      "1 teaspoon mustard seeds",
      "2 dry red chilies",
      "Few curry leaves",
      "2 tablespoons coconut oil",
      "1/2 teaspoon asafoetida",
      "Salt to taste",
      "1 cup cooked toor dal (pigeon peas)",
      "Tamarind pulp (size of small lime)"
    ],
    steps: [
      "Clean banana flower thoroughly and soak in buttermilk to prevent discoloration",
      "Pressure cook banana flower with turmeric and salt for 3 whistles",
      "Grind coconut with sambar powder to fine paste",
      "Heat oil, splutter mustard seeds, add red chilies and curry leaves",
      "Add cooked banana flower and mix well",
      "Add coconut paste and cooked toor dal",
      "Add tamarind pulp and adjust consistency with water",
      "Simmer for 10 minutes and serve hot with rice"
    ],
    tips: [
      "Wear gloves while cleaning banana flower to avoid staining",
      "Add a tsp of rice flour while grinding coconut for thickness",
      "Soak chopped banana flower in buttermilk to prevent browning",
      "Can add drumsticks for extra flavor"
    ],
    tags: ["Traditional", "Coconut", "Spicy"],
    color: "from-purple-500 to-indigo-600",
    calories: 320
  },
  {
    id: 7,
    title: "Grilled Pineapple Raita",
    description: "Cool yogurt dip with caramelized pineapple and cumin",
    time: "20 min",
    servings: 4,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=800&h=600&fit=crop&q=80",
    category: "Side",
    rating: 4.4,
    favorites: 89,
    ingredients: [
      "2 cups thick yogurt",
      "1 cup pineapple cubes",
      "1 teaspoon cumin seeds, roasted and crushed",
      "1/2 teaspoon black salt",
      "1/4 teaspoon black pepper powder",
      "1 green chili, finely chopped (optional)",
      "1 tablespoon honey or sugar",
      "1 tablespoon chopped mint leaves",
      "1 tablespoon oil for grilling"
    ],
    steps: [
      "Whisk yogurt until smooth",
      "Grill pineapple cubes until caramelized (2-3 minutes per side)",
      "Chop grilled pineapple into smaller pieces",
      "Mix all ingredients except mint in a bowl",
      "Add grilled pineapple and mix gently",
      "Garnish with mint leaves",
      "Chill for 30 minutes before serving",
      "Serve as dip or side dish"
    ],
    tips: [
      "Use Greek yogurt for thicker consistency",
      "Can use canned pineapple if fresh not available",
      "Add roasted cumin powder for smoky flavor",
      "Adjust sweetness according to pineapple sweetness"
    ],
    tags: ["Grilled", "Yogurt", "Tangy"],
    color: "from-yellow-400 to-amber-500",
    calories: 150
  },
  {
    id: 8,
    title: "Lotus Stem Crisps",
    description: "Crispy lotus stem chips with chaat masala",
    time: "30 min",
    servings: 4,
    difficulty: "Medium",
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&h=600&fit=crop&q=80",
    category: "Snack",
    rating: 4.7,
    favorites: 134,
    ingredients: [
      "2 lotus stems, cleaned and sliced thinly",
      "Oil for deep frying",
      "2 teaspoons chaat masala",
      "1 teaspoon red chili powder",
      "1/2 teaspoon black salt",
      "1/2 teaspoon regular salt",
      "1/4 teaspoon turmeric powder",
      "1 tablespoon rice flour (optional for extra crispiness)"
    ],
    steps: [
      "Clean lotus stems thoroughly and slice thinly (2mm thickness)",
      "Soak slices in water with turmeric for 10 minutes",
      "Pat dry completely with kitchen towel",
      "Heat oil to medium heat (170°C)",
      "Fry slices in batches until golden and crispy",
      "Drain on paper towels to remove excess oil",
      "Mix all spices in a bowl",
      "Sprinkle spice mix over hot chips and toss gently",
      "Serve immediately or store in airtight container"
    ],
    tips: [
      "Slice uniformly for even cooking",
      "Ensure lotus stems are completely dry before frying",
      "Fry on medium heat to prevent burning",
      "Add spice mix while chips are hot for better adherence"
    ],
    tags: ["Crispy", "Snack", "Spicy"],
    color: "from-rose-500 to-pink-600",
    calories: 190
  },
  {
    id: 9,
    title: "Coconut Avocado Chutney",
    description: "Creamy chutney with coconut, avocado, and green chilies",
    time: "10 min",
    servings: 4,
    difficulty: "Easy",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80",
    category: "Condiment",
    rating: 4.8,
    favorites: 156,
    ingredients: [
      "1 ripe avocado",
      "1 cup grated coconut (fresh or frozen)",
      "2-3 green chilies",
      "1/2 inch ginger",
      "1/4 cup fresh coriander leaves",
      "1 tablespoon lemon juice",
      "Salt to taste",
      "1 teaspoon oil",
      "1/2 teaspoon mustard seeds",
      "Few curry leaves"
    ],
    steps: [
      "Scoop out avocado flesh into blender",
      "Add grated coconut, green chilies, ginger, coriander",
      "Add lemon juice and salt",
      "Grind to smooth paste adding little water if needed",
      "Transfer to serving bowl",
      "Heat oil, splutter mustard seeds",
      "Add curry leaves and pour tempering over chutney",
      "Mix gently and serve immediately"
    ],
    tips: [
      "Use immediately as avocado oxidizes quickly",
      "Add lemon juice to prevent browning",
      "Can add yogurt for tangier version",
      "Adjust chili quantity according to spice preference"
    ],
    tags: ["Creamy", "Spicy", "Quick"],
    color: "from-green-500 to-emerald-600",
    calories: 160
  },
];

const categories = ["All", "Main", "Salad", "Beverage", "Side", "Snack", "Condiment"];
const difficulties = ["All", "Easy", "Medium", "Difficult"];
const timeRanges = ["All", "Quick (<20min)", "Medium (20-45min)", "Long (>45min)"];

const Recipes = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedTime, setSelectedTime] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty;
    const matchesTime = selectedTime === "All" || 
      (selectedTime === "Quick (<20min)" && parseInt(recipe.time) < 20) ||
      (selectedTime === "Medium (20-45min)" && parseInt(recipe.time) >= 20 && parseInt(recipe.time) <= 45) ||
      (selectedTime === "Long (>45min)" && parseInt(recipe.time) > 45);
    const matchesSearch = searchQuery === "" || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesDifficulty && matchesTime && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const handleRecipeClick = (recipe: any) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const RecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <AnimatePresence>
        {showRecipeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecipeModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-10 z-50 overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="flex justify-between items-center p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${selectedRecipe.color}`} />
                    <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.title}</h2>
                  </div>
                  <Button
                    onClick={() => setShowRecipeModal(false)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  {/* Left Column */}
                  <div className="md:col-span-2">
                    {/* Quote Section */}
                    <div className="mb-8">
                      
                      <p className="text-gray-600 text-lg">
                        {selectedRecipe.description}
                      </p>
                    </div>

                    {/* Recipe Details */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-gray-700" />
                          <span className="font-semibold text-gray-900">Prep time</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedRecipe.time}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-gray-700" />
                          <span className="font-semibold text-gray-900">Servings</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedRecipe.servings}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ChefHat className="w-5 h-5 text-gray-700" />
                          <span className="font-semibold text-gray-900">Difficulty</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedRecipe.difficulty}</div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        Ingredients
                      </h3>
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <ul className="space-y-3">
                          {selectedRecipe.ingredients.map((ingredient: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {index + 1}
                              </div>
                              <span className="text-gray-700">{ingredient}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Image */}
                  <div className="md:col-span-1">
                    <div className="sticky top-8">
                      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl mb-6">
                        <img 
                          src={selectedRecipe.image} 
                          alt={selectedRecipe.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <span className={`bg-gradient-to-r ${selectedRecipe.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                            {selectedRecipe.category}
                          </span>
                          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-gray-900">{selectedRecipe.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Nutrition Info */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-5 h-5 text-orange-500" />
                          <span className="font-semibold text-gray-900">Nutrition Info</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedRecipe.calories} <span className="text-sm font-normal text-gray-600">calories per serving</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Steps */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-amber-500" />
                    Recipe Steps
                  </h3>
                  <div className="space-y-4">
                    {selectedRecipe.steps.map((step: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tips Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">♻️ Zero-Waste Tips</h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                    <ul className="space-y-3">
                      {selectedRecipe.tips.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                            ✓
                          </span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedRecipe.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

               
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Quote Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="pl-[300px] text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight grid justify-start">
                <span className="text-[#3A0F2E]">From Farm</span>
                <span className="text-white justify-self-end">To Table</span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-800 text-3xl md:text-4xl font-serif italic leading-tight mb-8"
              >
                "Zero-waste recipes with seasonal vegetables and fruits using every part with love"
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-[#F694C3] to-pink-500 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Difficulty
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <motion.button
                        key={difficulty}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedDifficulty === difficulty
                            ? "bg-gradient-to-r from-[#F694C3] to-pink-500 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                        }`}
                      >
                        {difficulty}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Time
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {timeRanges.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedTime === time
                            ? "bg-gradient-to-r from-[#F694C3] to-pink-500 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Recipe Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-gray-600">
                  Zero-waste cooking with seasonal produce
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {selectedCategory !== "All" && (
                  <span className="font-semibold text-[#F694C3]">Category: {selectedCategory}</span>
                )}
                {selectedDifficulty !== "All" && ` • ${selectedDifficulty}`}
                {selectedTime !== "All" && ` • ${selectedTime}`}
              </div>
            </div>

            {/* Search Bar Section - Kept in same position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search recipes, ingredients, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-3 text-base rounded-full border-2 border-gray-300 bg-white shadow-sm focus:border-[#F694C3] focus:ring-2 focus:ring-[#F694C3]/20"
                />
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-[#CD98ED] to-purple-500 hover:from-[#CD98ED]/90 hover:to-purple-600 rounded-full"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredRecipes.map((recipe, index) => (
                <motion.article
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative"
                  onClick={() => handleRecipeClick(recipe)}
                >
                  <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-lg group-hover:shadow-xl group-hover:border-gray-300 relative h-full cursor-pointer transition-all duration-300">
                    {/* Image Container */}
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <motion.span 
                        className={`absolute top-4 left-4 bg-gradient-to-r ${recipe.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      >
                        {recipe.category}
                      </motion.span>
                      
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(recipe.id);
                        }}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            favorites.includes(recipe.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-gray-700"
                          }`}
                        />
                      </motion.button>
                      
                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-gray-900">{recipe.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {recipe.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.tags.map((tag: string) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-4">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{recipe.time}</span>
                          </div>
                          <div className="text-xs text-gray-600">Prep Time</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{recipe.servings}</span>
                          </div>
                          <div className="text-xs text-gray-600">Servings</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                            <ChefHat className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{recipe.difficulty}</span>
                          </div>
                          <div className="text-xs text-gray-600">Level</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results */}
          <AnimatePresence>
            {filteredRecipes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center py-16"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                  <Search className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No recipes found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="rounded-full"
                  >
                    Clear Search
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedDifficulty("All");
                      setSelectedTime("All");
                      setSearchQuery("");
                    }}
                    className="rounded-full bg-gradient-to-r from-[#F694C3] to-pink-500 hover:from-pink-500 hover:to-[#F694C3]"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Recipe Modal */}
      <RecipeModal />
    </Layout>
  );
};

export default Recipes;