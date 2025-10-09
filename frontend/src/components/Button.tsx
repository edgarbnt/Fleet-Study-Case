import React from 'react';
import clsx from 'clsx';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'danger';
    loading?: boolean;
    small?: boolean;
}

export const Button: React.FC<Props> = ({
                                            variant = 'primary',
                                            loading,
                                            small,
                                            className,
                                            children,
                                            ...rest
                                        }) => (
    <button
        className={clsx('btn', variant, small && 'small', className, loading && 'loading')}
        disabled={loading || rest.disabled}
        {...rest}
    >
        {loading ? '…' : children}
    </button>
);