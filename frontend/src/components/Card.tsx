import React from 'react';
import clsx from 'clsx';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={clsx('card', className)}>{children}</div>
);