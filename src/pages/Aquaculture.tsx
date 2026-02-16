import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProbioticsProducts } from './Probiotics';
import DiseaseManagement from './DiseaseManagement';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Aquaculture = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('category') || 'probiotics');
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const tabsRef = React.useRef<HTMLDivElement>(null);

    const tabs = [
        {
            id: 'probiotics',
            label: 'Probiotics',
            component: ProbioticsProducts
        },
        {
            id: 'disease-management',
            label: 'Disease Management',
            component: DiseaseManagement
        }
    ];

    // Update URL when tab changes
    useEffect(() => {
        setSearchParams({ category: activeTab });
    }, [activeTab, setSearchParams]);

    // Check scroll position for arrow visibility
    useEffect(() => {
        const checkScroll = () => {
            if (tabsRef.current) {
                setShowLeftArrow(tabsRef.current.scrollLeft > 0);
                setShowRightArrow(
                    tabsRef.current.scrollLeft < tabsRef.current.scrollWidth - tabsRef.current.clientWidth
                );
            }
        };

        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (tabsRef.current) {
            const scrollAmount = 300;
            tabsRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (tabsRef.current) {
            setShowLeftArrow(tabsRef.current.scrollLeft > 0);
            setShowRightArrow(
                tabsRef.current.scrollLeft < tabsRef.current.scrollWidth - tabsRef.current.clientWidth
            );
        }
    };

    const activeTabData = tabs.find(tab => tab.id === activeTab);
    const ActiveComponent = activeTabData?.component || ProbioticsProducts;

    return (
        <Layout>
            <div className="w-full">
                {/* Sticky Tabs Navigation */}
                <div className="sticky top-[116px] md:top-[136px] z-30 bg-blue-50/95 backdrop-blur border-b border-blue-200 shadow-sm">
                    <div className="container mx-auto px-4">
                        <div className="relative flex items-center">
                            {/* Left Arrow */}
                            {showLeftArrow && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-0 z-10 text-gray-600 hover:text-gray-900"
                                    onClick={() => scroll('left')}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            )}

                            {/* Tabs Container */}
                            <div
                                ref={tabsRef}
                                className="flex w-full gap-3 overflow-x-auto scrollbar-hide px-10 py-4 md:justify-center"
                                onScroll={handleScroll}
                                style={{
                                    scrollBehavior: 'smooth',
                                    msOverflowStyle: 'none',
                                    scrollbarWidth: 'none'
                                }}
                            >
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-2.5 font-semibold text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0 rounded-full ${activeTab === tab.id
                                            ? 'text-blue-800 border-blue-500 bg-white shadow-md ring-1 ring-blue-200'
                                            : 'text-blue-700/80 border-transparent bg-white/60 hover:bg-white hover:text-blue-800 hover:border-blue-200'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Right Arrow */}
                            {showRightArrow && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 z-10 text-gray-600 hover:text-gray-900"
                                    onClick={() => scroll('right')}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <ActiveComponent />
                </motion.div>
            </div>
        </Layout>
    );
};

export default Aquaculture;
