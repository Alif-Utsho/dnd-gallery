import React, { forwardRef, useState } from 'react';

export const Photo = forwardRef(
    ({ url, index, faded, style, checkedIndexes, handleCheckboxChange, isChecked, ...props }, ref) => {
        const [isHovered, setIsHovered] = useState(false);

        const inlineStyles = {
            opacity: faded ? '0.2' : '1',
            transformOrigin: '0 0',
            height: index === 0 ? (window.innerWidth < 500 ? 200 : 310) : (window.innerWidth < 400 ? 95 : 150),
            gridRowStart: index === 0 ? 'span 2' : null,
            gridColumnStart: index === 0 ? 'span 2' : null,
            backgroundColor: 'white',
            border: '1px solid lightgray',
            borderRadius: '10px',
            position: 'relative',
            ...style,
        };

        const imgStyles = {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '10px',
        };

        const overlayStyles = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isHovered || isChecked ? 1 : 0,
            backgroundColor: isChecked ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
            borderRadius: '10px',
            transition: 'opacity 0.3s ease',
        };


        const handleMouseEnter = () => {
            setIsHovered(true);
        };  

        const handleMouseLeave = () => {
            setIsHovered(false);
        };

        return (
            <div
                ref={ref}
                style={inlineStyles}
                {...props}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <img src={url} alt="" style={imgStyles} />
                <div style={overlayStyles}></div>
            </div>
        );
    }
);
