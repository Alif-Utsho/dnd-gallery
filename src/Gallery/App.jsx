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

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

                return arrayMove(items, oldIndex, newIndex);
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

    const imageMouseEnter = (e, i) => {
        const { checkedIndexes } = this.state;
        if (!checkedIndexes.includes(i)) {
            e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            e.currentTarget.querySelector('.checkbox').style.opacity = 1;
        }
    }

    const imageMouseLeave = (e, i) => {
        const { checkedIndexes } = this.state;
        if (!checkedIndexes.includes(i)) {
            e.currentTarget.querySelector('.overlay').style.backgroundColor = 'rgba(0, 0, 0, 0)';
            e.currentTarget.querySelector('.checkbox').style.opacity = 0;
        }
    }

    console.log(checkedIndexes);
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>

                <div className="card container col-md-8 m-5 mx-auto border-0">
                    <div className='card-header bg-white'>
                        <div className="d-flex justify-content-between">
                            <div>
                                <h5 className="card-title my-1">
                                    {checkedIndexes.length > 0 ? (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="me-2 w-4 h-4"
                                                checked
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
                                    <a onClick={()=>handleDelete()} style={{ cursor: 'pointer' }} className='text-danger fs-5'>Delete File{checkedIndexes.length > 1 ? 's' : ''} </a>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="card-body">
                        <Grid columns={5}>
                            {items.map((url, index) => (
                                <SortablePhoto
                                    key={url}
                                    url={url} 
                                    index={index} 
                                    isChecked = {checkedIndexes.includes(index)}
                                    checkedIndexes={checkedIndexes}
                                    handleCheckboxChange={handleCheckboxChange}
                                />
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
