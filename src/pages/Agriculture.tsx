import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useTranslation } from '@/contexts/LanguageContext';
import SoilApplications from './SoilApplications';
import FoliarApplications from './FoliarApplications';
import DripApplications from './DripApplications';
import CropProtection from './CropProtection';
import SpecialApplications from './SpecialApplications';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Agricultural = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('category') || 'soil');
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const tabsRef = React.useRef<HTMLDivElement>(null);
    const t = useTranslation();

    const tabs = [
        {
            id: 'soil',
            label: t.nav.soilApplications,
            component: SoilApplications
        },
        {
            id: 'foliar',
            label: t.nav.foliarApplications,
            component: FoliarApplications
        },
        {
            id: 'drip',
            label: t.nav.dripApplications,
            component: DripApplications
        },
        {
            id: 'crop-protection',
            label: t.nav.cropProtection,
            component: CropProtection
        },
        {
            id: 'special',
            label: t.nav.specialApplications,
            component: SpecialApplications
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
    const ActiveComponent = activeTabData?.component || SoilApplications;

    return (
        <Layout>
            <div className="w-full">
                {/* Sticky Tabs Navigation */}
                <div className="sticky top-[68px] md:top-[136px] z-30 bg-gradient-to-b from-green-50/95 to-white/95 backdrop-blur border-b border-green-200/80 shadow-sm">
                    <div className="container mx-auto px-3 sm:px-4">
                        <div className="relative flex items-center">
                            {/* Left Arrow */}
                            {showLeftArrow && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-0 z-10 text-green-700 hover:text-green-900 hover:bg-green-100/80"
                                    onClick={() => scroll('left')}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                            )}

                            {/* Tabs Container */}
                            <div
                                ref={tabsRef}
                                className="flex w-full gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-10 py-3 md:justify-center"
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
                                        className={`px-4 sm:px-5 py-2.5 font-semibold text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0 rounded-full ${activeTab === tab.id
                                            ? 'text-green-800 border-green-500 bg-white shadow-md ring-1 ring-green-200 scale-[1.01]'
                                            : 'text-green-700/80 border-transparent bg-white/70 hover:bg-white hover:text-green-800 hover:border-green-200'
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
                                    className="absolute right-0 z-10 text-green-700 hover:text-green-900 hover:bg-green-100/80"
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

export default Agricultural;
