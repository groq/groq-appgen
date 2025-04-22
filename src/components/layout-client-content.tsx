'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

interface LayoutClientContentProps {
    children: React.ReactNode;
}

export function LayoutClientContent({ children }: LayoutClientContentProps) {
    const pathname = usePathname();
    // Determine bottom offset based on path
    const modeToggleBottomClass = pathname.startsWith('/apps/') ? 'bottom-16' : 'bottom-8';

    return (
        <>
            {children}
            {/* ModeToggle with conditional positioning */}
            <div className={`fixed ${modeToggleBottomClass} right-4 z-10`}>
                <ModeToggle />
            </div>
        </>
    );
} 