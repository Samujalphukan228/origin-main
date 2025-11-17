"use client";

import { MenuProvider } from '@/context/MenuContext';
import { OrderProvider } from '@/context/OrderContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }) {
    return (
        <MenuProvider>
            <OrderProvider>
                {children}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#fff',
                            color: '#5F6754',
                            border: '1px solid #e5e7eb',
                        },
                        success: {
                            iconTheme: {
                                primary: '#5F6754',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </OrderProvider>
        </MenuProvider>
    );
}