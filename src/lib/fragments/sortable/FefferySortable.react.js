import React, { useEffect } from "react";
import { propTypes, defaultProps } from '../../components/sortable/FefferySortable.react';
import {
    DndContext,
    useSensors,
    useSensor,
    PointerSensor,
    closestCenter,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    horizontalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined, MenuOutlined, DragOutlined } from "@ant-design/icons";
import useCss from "../../hooks/useCss";
import { isString, isEqual } from 'lodash';

const type2icon = new Map([
    ['holder', HolderOutlined],
    ['menu', MenuOutlined],
    ['drag', DragOutlined],
])


const SortableItem = React.memo(
    ({
        id,
        style: containerStyle, // 重命名消除歧义
        draggingStyle,
        className,
        draggingClassName,
        children,
        handleStyle,
        handleClassName,
        handlePosition,
        handleType,
        maxTranslateX,
        maxTranslateY,
        itemDraggingScale,
        setProps,
        value,
        multiple,
        allowNoValue,
        selectedStyle
    }) => {

        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            setActivatorNodeRef,
            isDragging
        } = useSortable({ id: id });

        const style = {
            transform: CSS.Transform.toString(
                transform && {
                    ...{
                        ...transform,
                        x: (maxTranslateX || maxTranslateX === 0) ? maxTranslateX : transform.x,
                        y: (maxTranslateY || maxTranslateY === 0) ? maxTranslateY : transform.y
                    },
                    scaleX: 1,
                    scaleY: 1,
                    ...(
                        isDragging ?
                            {
                                scaleX: itemDraggingScale,
                                scaleY: itemDraggingScale
                            } :
                            {}
                    )
                }
            ),
            transition,
            display: 'flex',
            alignItems: 'center',
            ...containerStyle,
            ...(
                isDragging
                    ? {
                        position: 'relative',
                        zIndex: 999,
                        ...draggingStyle
                    }
                    : {}
            ),
            // 处理已选中状态
            ...(
                (
                    Array.isArray(value) ?
                        value.includes(id) :
                        value === id
                ) ?
                    selectedStyle :
                    {}
            )
        };

        return (
            <div id={id}
                ref={setNodeRef}
                {...attributes}
                style={style}
                className={
                    isDragging ?
                        (
                            isString(className) ?
                                className :
                                (className ? useCss(className) : undefined)
                        ) :
                        (
                            isString(draggingClassName) ?
                                draggingClassName :
                                (draggingClassName ? useCss(draggingClassName) : undefined)
                        )
                }
                children={
                    <>
                        {handlePosition === 'end' ? <div style={{ flex: 'auto' }}>{children}</div> : null}
                        {React.createElement(
                            type2icon.get(handleType),
                            {
                                style: {
                                    color: '#737373',
                                    touchAction: "none",
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    flex: 'none',
                                    ...handleStyle
                                },
                                className: (
                                    isString(handleClassName) ?
                                        handleClassName :
                                        (handleClassName ? useCss(handleClassName) : undefined)
                                ),
                                ref: setActivatorNodeRef,
                                ...listeners
                            }
                        )}
                        {handlePosition === 'start' ? <div style={{ flex: 'auto' }}>{children}</div> : null}
                    </>
                }
                onClick={() => {
                    // 处理点击选中功能
                    // 单选模式
                    if (!multiple) {
                        if (id === value) {
                            // 若允许空值
                            if (allowNoValue) {
                                setProps({
                                    value: null
                                })
                            }
                        } else {
                            setProps({
                                value: id
                            })
                        }
                    } else {
                        // 多选模式
                        if (value) {
                            if (Array.isArray(value)) {
                                if (value.includes(id)) {
                                    if (value.length === 1) {
                                        // 若允许空值
                                        if (allowNoValue) {
                                            setProps({
                                                value: value.filter(item => item !== id)
                                            })
                                        }
                                    } else {
                                        setProps({
                                            value: value.filter(item => item !== id)
                                        })
                                    }
                                } else {
                                    setProps({
                                        value: [...value, id]
                                    })
                                }
                            } else {
                                if (id === value) {
                                    // 若允许空值
                                    if (allowNoValue) {
                                        setProps({
                                            value: []
                                        })
                                    }
                                } else {
                                    setProps({
                                        value: [value, id]
                                    })
                                }
                            }
                        } else {
                            setProps({
                                value: [id]
                            })
                        }
                    }
                }}
            />
        );
    },
    (prevProps, nextProps) => {
        return isEqual(prevProps.children, nextProps.children) && prevProps.value === nextProps.value;
    }
)

// 定义排序列表组件FefferySortable
const FefferySortable = (props) => {

    const {
        id,
        style,
        handleStyle,
        className,
        handleClassName,
        items,
        currentOrder,
        direction,
        itemDraggingScale,
        handlePosition,
        handleType,
        maxTranslateX,
        maxTranslateY,
        value,
        multiple,
        allowNoValue,
        selectedStyle,
        setProps,
        loading_state
    } = props;

    // 初始化currentOrder
    useEffect(() => {
        if (!currentOrder) {
            setProps({
                currentOrder: items.map(item => item.key)
            })
        }
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const onSortEnd = (e) => {
        let { active, over } = e;
        let _items = (currentOrder || items.map(item => item.key))
            .map(key => items.find(item => item.key === key))
        if (active?.id !== over?.id) {
            let activeIndex = _items.findIndex((item) => item.key === active?.id);
            let overIndex = _items.findIndex((item) => item.key === over?.id);
            setProps({
                currentOrder: arrayMove(_items, activeIndex, overIndex).map(item => item.key)
            })
        }
    };

    // 按照currentOrder位置取出对应子项元素
    let reorderItems = (currentOrder || items.map(item => item.key))
        .map(key => items.find(item => item.key === key))
        .map(item => ({ ...item, id: item.key }))

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onSortEnd}
        >
            <SortableContext
                items={reorderItems}
                strategy={
                    direction === 'horizontal' ?
                        horizontalListSortingStrategy :
                        verticalListSortingStrategy
                }>
                <ul id={id}
                    style={{
                        paddingLeft: 0,
                        ...style
                    }}
                    className={
                        isString(className) ?
                            className :
                            (className ? useCss(className) : undefined)
                    }
                    data-dash-is-loading={
                        (loading_state && loading_state.is_loading) || undefined
                    }>
                    {reorderItems.map((item) => (
                        <SortableItem id={item.key}
                            key={item.key}
                            style={item.style}
                            draggingStyle={item.draggingStyle}
                            className={item.className}
                            draggingClassName={item.draggingClassName}
                            children={item.content}
                            handleStyle={handleStyle}
                            handleClassName={handleClassName}
                            handlePosition={handlePosition}
                            handleType={handleType}
                            maxTranslateX={maxTranslateX}
                            maxTranslateY={maxTranslateY}
                            itemDraggingScale={itemDraggingScale}
                            setProps={setProps}
                            value={value}
                            multiple={multiple}
                            allowNoValue={allowNoValue}
                            selectedStyle={selectedStyle} />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    )
}

export default React.memo(FefferySortable);

FefferySortable.defaultProps = defaultProps;
FefferySortable.propTypes = propTypes;