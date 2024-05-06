import React, { useState, ReactNode } from 'react';
import { Alert, VStack, HStack, IconButton, CloseIcon, Text } from 'native-base';
import { v4 as uuidv4 } from 'uuid';

interface Toast {
    id: string;
    title: string;
    description: string;
    status: 'info' | 'warning' | 'success' | 'error';
    variant: 'solid' | 'subtle' | 'left-accent' | 'top-accent' | 'outline';
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastAlert: React.FC<ToastProps> = ({ toast, onClose }) => {
    return (
        <Alert
            maxWidth="100%"
            alignSelf="center"
            flexDirection="row"
            status={toast.status}
            variant={toast.variant}
            isClosable
        >
            <VStack space={1} flexShrink={1} w="100%">
                <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                    <HStack space={2} flexShrink={1} alignItems="center">
                        <Alert.Icon />
                        <Text selectable fontSize="md" fontWeight="medium" flexShrink={1}>
                            {toast.title}
                        </Text>
                    </HStack>
                    <IconButton
                        variant="unstyled"
                        icon={<CloseIcon size="3" />}
                        onPress={() => onClose(toast.id)}
                    />
                </HStack>
                <Text selectable px="6">{toast.description}</Text>
            </VStack>
        </Alert>
    );
};

interface ToastNotifyProps {
    children: (addToast: (toast: Omit<Toast, 'id'>) => void) => ReactNode;
}

export const ToastNotify: React.FC<ToastNotifyProps> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = uuidv4();
        setToasts([...toasts, { ...toast, id }]);
        setTimeout(() => removeToast(id), 5000); // Auto-close after 5 seconds
    };

    const removeToast = (id: string) => {
        setToasts(toasts.filter(toast => toast.id !== id));
    };

    return (
        <>
            {children(addToast)}
            <VStack space={2} p="4" position="absolute" w="100%" top="0">
                {toasts.map(toast => (
                    <ToastAlert key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </VStack>
        </>
    );
};
