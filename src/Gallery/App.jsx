import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
} from '@dnd-kit/sortable';

import { Grid } from './Grid';
import { SortablePhoto } from './SortablePhoto';
import { Photo } from './Photo';
import photos from './photos.json';

const UploadGallery = () => {
    const [checkedIndexes, setCheckedIndexes] = useState([]);
    const [items, setItems] = useState(photos);
    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const [hoveredIndex, setHoveredIndex] = useState(null);

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
            });

            setCheckedIndexes((checkedIndexes) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                if (checkedIndexes.includes(oldIndex)) {
                    const updatedCheckedIndexes = checkedIndexes.map((index) =>
                        index === oldIndex ? newIndex : index
                    );
                    return updatedCheckedIndexes;
                }

                return checkedIndexes;
            });
            
        }


        setActiveId(null);
    }

    function handleDragCancel() {
        setActiveId(null);
    }

    const handleDelete = () => {
        const filteredImages = items.filter((image, index) => !checkedIndexes.includes(index));

        const checkboxes = document.querySelectorAll('.checkbox');
        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        setItems(filteredImages);
        setCheckedIndexes([]);
    };

    const handleCheckboxChange = (index) => {
        if (checkedIndexes.includes(index)) {
            setCheckedIndexes(checkedIndexes.filter((i) => i !== index));
        } else {
            setCheckedIndexes([...checkedIndexes, index]);
        }
    };

    const restorePhoto = () => {
        setItems(photos);
    }

    const deselectAll = () => {
        setCheckedIndexes([]);
    }

    const getCheckboxStyles = (index) => {
        return {
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 5,
            width: '20px',
            height: '20px',
            opacity: (hoveredIndex === index) || checkedIndexes.includes(index) ? 1 : 0,
            transition: 'opacity 0.3s ease',
        };

    };

    const getInlineStyles = (currentIndex) => {
        return {
            opacity: 1,
            gridRowStart: currentIndex === 0 ? 'span 2' : null,
            gridColumnStart: currentIndex === 0 ? 'span 2' : null,
            backgroundColor: 'white',
            borderRadius: '10px',
            position: 'relative',
        };
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>

                <div className="card container col-md-8 m-5 mx-auto p-0 border-0">
                    <div className='card-header bg-white'>
                        <div className="d-flex justify-content-between">
                            <div>
                                <h5 className="card-title my-1">
                                    {checkedIndexes.length > 0 ? (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                style={{ width: '15px', height: '15px'}}
                                                className="me-2 w-4 h-4"
                                                onChange={deselectAll}
                                                defaultChecked
                                            />
                                            <span>{`${checkedIndexes.length} File${checkedIndexes.length > 1 ? 's' : ''} Selected`}</span>
                                        </div>
                                    ) : (
                                        'Gallery'
                                    )}
                                </h5>
                            </div>
                            <div>
                                {checkedIndexes.length > 0 && (
                                    <a onClick={() => handleDelete()} style={{ cursor: 'pointer' }} className='text-danger fs-5'>Delete File{checkedIndexes.length > 1 ? 's' : ''} </a>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="card-body">

                        {
                            items.length <= 0 && (
                                <div className='text-center my-5'>
                                    <h3> <span className='text-danger'>Oops!</span> All photos have been deleted.</h3>
                                    <h6 className='mt-3'>Wanna Restore? <span onClick={restorePhoto} className='text-primary' style={{cursor: 'pointer'}}>Click me</span></h6>
                                </div>
                            )
                        }

                        <Grid columns={window.innerWidth < 500 ? 3 : 5}>
                            {items.map((url, index) => (

                                <div
                                    key={index}
                                    style={getInlineStyles(index)}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <SortablePhoto
                                        key={url}
                                        url={url}
                                        index={index}
                                        isChecked={checkedIndexes.includes(index)}
                                        checkedIndexes={checkedIndexes}
                                        handleCheckboxChange={handleCheckboxChange}
                                    />

                                    <input
                                        type="checkbox"
                                        style={getCheckboxStyles(index)}
                                        checked={checkedIndexes.includes(index)}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </div>
                            ))}
                        </Grid>
                    </div>
                </div>
            </SortableContext>

            <DragOverlay adjustScale={true} style={{ pointerEvents: 'none' }}>
                {activeId ? (
                    <Photo url={activeId} index={items.indexOf(activeId)} />
                ) : null}
            </DragOverlay>
        </DndContext>
    );


};

export default UploadGallery;
