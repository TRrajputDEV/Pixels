// src/components/ui/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'medium', color = 'red' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    const colorClasses = {
        red: 'border-red-600',
        blue: 'border-blue-600',
        gray: 'border-gray-600'
    };

    return (
        <div className="flex justify-center items-center">
            <div 
                className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
            />
        </div>
    );
};

export default LoadingSpinner;
