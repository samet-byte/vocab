import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Layers, Shuffle } from 'lucide-react';

const WordMemorizationApp = () => {
    const [words, setWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showBack, setShowBack] = useState(false);
    const [showBoth, setShowBoth] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://g--s.vercel.app/api/v1?id=1sbV3gvXuWOOzCat_P27HEaPjcHK1h4hVpzWmG7_HE4U');
                const jsonData = await response.json();
                const filteredData = jsonData.data.filter(item => item.back !== "#VALUE!");
                setWords(shuffleArray(filteredData));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handlePress = useCallback(() => setShowBack(true), []);
    const handleRelease = useCallback(() => setShowBack(false), []);

    const handlePrevious = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + words.length) % words.length);
    }, [words.length]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, [words.length]);

    const toggleShowBoth = useCallback(() => setShowBoth(prev => !prev), []);

    const shuffleWords = useCallback(() => {
        setWords(shuffleArray);
        setCurrentIndex(0);
    }, []);

    if (words.length === 0) {
        return <div className="text-white font-bold text-center text-2xl">Loading...</div>;
    }

    const currentWord = words[currentIndex];

    return (
        <div className="h-screen w-screen bg-gray-900 flex flex-col">
            {/* Word area (75%) */}
            <div
                className="flex-grow flex items-center justify-center w-full h-3/4"
                onMouseDown={handlePress}
                onMouseUp={handleRelease}
                onTouchStart={handlePress}
                onTouchEnd={handleRelease}
            >
                {/* Word text, centered */}
                <div className="text-white font-bold text-8xl text-center relative w-full px-4">
                    {showBoth ? (
                        <>
                            <div className="absolute top-0 left-0 right-0 opacity-25 text-4xl">{currentWord.back}</div>
                            <div className="mt-16">{currentWord.front}</div>
                        </>
                    ) : (
                        showBack ? currentWord.back : currentWord.front
                    )}
                </div>
            </div>

            {/* Button area (25%) */}
            <div className="h-1/4 flex justify-center items-center w-full p-6 bg-gray-800 space-x-12">
                {/* Previous button */}
                <button onClick={handlePrevious} className="text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft size={48} />
                </button>

                {/* Shuffle button */}
                <button onClick={shuffleWords} className="text-white hover:text-gray-300 transition-colors">
                    <Shuffle size={48} />
                </button>

                {/* Show both sides button */}
                <button onClick={toggleShowBoth} className="text-white hover:text-gray-300 transition-colors">
                    <Layers size={48} />
                </button>

                {/* Next button */}
                <button onClick={handleNext} className="text-white hover:text-gray-300 transition-colors">
                    <ChevronRight size={48} />
                </button>
            </div>
        </div>
    );
};

export default WordMemorizationApp;