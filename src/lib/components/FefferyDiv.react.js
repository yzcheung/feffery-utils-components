import React, { useEffect, useRef } from 'react';
import useCss from '../hooks/useCss'
import { isString, isNull } from 'lodash';
import PropTypes from 'prop-types';
import { useElementBounding, useFocus } from '@reactuses/core';
import { useSize, useRequest, useHover, useClickAway } from 'ahooks';
import './styles.css'

// 定义兼容虚拟className的阴影效果、滚动条样式字典
const shadowVirtualClassName = new Map(
    [
        [
            'hover-shadow',
            {
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0 8px 24px rgba(81, 87, 103, 0.16)',
                    transition: 'box-shadow 0.3s ease-in-out'
                }
            }
        ],
        [
            'always-shadow',
            {
                boxShadow: '0 8px 24px rgba(81, 87, 103, 0.16)'
            }
        ],
        [
            'hover-shadow-light',
            {
                transition: 'box-shadow 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.12)',
                    transition: 'box-shadow 0.3s ease-in-out'
                }
            }
        ],
        [
            'always-shadow-light',
            {
                boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.12)'
            }
        ]
    ]
)

const scrollbarVirtualClassName = new Map(
    [
        [
            'simple',
            {
                '&::-webkit-scrollbar': {
                    width: '6px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#e4e6eb',
                    outline: 'none',
                    borderRadius: '2px'
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: 'none',
                    borderRadius: '2px'
                }
            }
        ],
        [
            'hidden',
            {
                '&::-webkit-scrollbar': {
                    width: 0
                },
                scrollbarWidth: 'none'
            }
        ]
    ]
)

// 定义进阶div容器组件FefferyDiv
const FefferyDiv = (props) => {
    // 取得必要属性或参数
    let {
        id,
        key,
        children,
        style,
        className,
        mouseEnterCount,
        mouseLeaveCount,
        nClicks,
        nDoubleClicks,
        enableListenContextMenu,
        debounceWait,
        clickAwayCount,
        enableFocus,
        isFocused,
        shadow,
        scrollbar,
        textAlign,
        justify,
        align,
        padding,
        margin,
        border,
        borderRadius,
        enableClickAway,
        wheelEventStrategy,
        setProps,
        loading_state
    } = props;

    const ref = useRef(null);
    const size = useSize(ref);
    const _bounding = useElementBounding(ref);
    const _isHovering = useHover(ref);
    const [_focus, setFocus] = useFocus(ref)

    useEffect(() => {
        setProps({
            isFocused: _focus
        })
    }, [_focus])

    useEffect(() => {
        if (!isNull(isFocused)) {
            setFocus(isFocused)
        }
    }, [isFocused])

    // 更新位置信息
    useEffect(() => {
        setProps({
            position: {
                x: _bounding.x,
                y: _bounding.y
            }
        })
    }, [_bounding])

    // 处理鼠标滚轮事件处理策略
    useEffect(() => {
        const handleWheel = (e) => {
            if (wheelEventStrategy === 'internally-only') {
                console.log('触发！')
                // 拦截当前触发的滚轮事件
                e.preventDefault();
            }
        };

        if (ref.current) {
            ref.current.addEventListener('wheel', handleWheel);
        }

        return () => {
            if (ref.current) {
                ref.current.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    // 防抖更新容器尺寸
    const { run: updateWidthHeight } = useRequest(
        (e) => {
            if (e) {
                // 监听div容器尺寸变化从而刷新_width，_height属性值
                setProps({
                    _width: size.width,
                    _height: size.height
                })
            }
        },
        {
            debounceWait: debounceWait,
            manual: true
        }
    )

    // 当size变化时进行_width、_height的更新
    useEffect(() => {
        updateWidthHeight(size)
    }, [size]);

    // 当_isHovering变化时进isHovering状态的更新
    useEffect(() => {
        setProps({
            isHovering: _isHovering
        })
    }, [_isHovering])

    // 监听元素外点击事件
    if (enableClickAway) {
        useClickAway(() => {
            setProps({ clickAwayCount: clickAwayCount + 1 })
        }, ref);
    }

    // 若className为字符串或为空
    if (isString(className) || !className) {
        // 根据shadow参数预处理className
        if (shadow === 'hover-shadow') {
            className = className ? `${className} feffery-div-hover-shadow` : 'feffery-div-hover-shadow'
        } else if (shadow === 'always-shadow') {
            className = className ? `${className} feffery-div-always-shadow` : 'feffery-div-always-shadow'
        } else if (shadow === 'hover-shadow-light') {
            className = className ? `${className} feffery-div-hover-shadow-light` : 'feffery-div-hover-shadow-light'
        } else if (shadow === 'always-shadow-light') {
            className = className ? `${className} feffery-div-always-shadow-light` : 'feffery-div-always-shadow-light'
        }

        // 根据scrollbar参数预处理className
        if (scrollbar === 'simple') {
            className = className ? `${className} feffery-div-scrollbar-simple` : 'feffery-div-scrollbar-simple'
        } else if (scrollbar === 'hidden') {
            className = className ? `${className} feffery-div-scrollbar-hidden` : 'feffery-div-scrollbar-hidden'
        }
    } else {
        // 否则则为对象型，进行虚拟化className改造
        // 根据shadow参数预处理className
        if (shadow === 'hover-shadow') {
            className = {
                ...shadowVirtualClassName.get('hover-shadow'),
                ...className,
                '&:hover': {
                    ...shadowVirtualClassName.get('hover-shadow')['&:hover'],
                    ...className['&:hover']
                }
            }
        } else if (shadow === 'always-shadow') {
            className = {
                ...shadowVirtualClassName.get('always-shadow'),
                ...className
            }
        } else if (shadow === 'hover-shadow-light') {
            className = {
                ...shadowVirtualClassName.get('hover-shadow-light'),
                ...className,
                '&:hover': {
                    ...shadowVirtualClassName.get('hover-shadow-light')['&:hover'],
                    ...className['&:hover']
                }
            }
        } else if (shadow === 'always-shadow-light') {
            className = {
                ...shadowVirtualClassName.get('always-shadow-light'),
                ...className
            }
        }

        // 根据scrollbar参数预处理className
        if (scrollbar === 'simple') {
            className = {
                ...scrollbarVirtualClassName.get('simple'),
                ...className
            }
        } else if (scrollbar === 'hidden') {
            className = {
                ...scrollbarVirtualClassName.get('hidden'),
                ...className
            }
        }
    }

    return <div
        id={id}
        key={key}
        style={
            {
                textAlign,
                justifyContent: justify,
                alignItems: align,
                padding,
                margin,
                border,
                borderRadius,
                display: justify || align ? 'flex' : null,
                ...style
            }
        }
        className={
            isString(className) ?
                className :
                (className ? useCss(className) : undefined)
        }
        ref={ref}
        onClick={() => setProps({ nClicks: nClicks + 1 })}
        onDoubleClick={() => setProps({ nDoubleClicks: nDoubleClicks + 1 })}
        onContextMenu={(e) => {
            if (enableListenContextMenu) {
                e.preventDefault()
                setProps({
                    contextMenuEvent: {
                        pageX: e.pageX,
                        pageY: e.pageY,
                        clientX: e.clientX,
                        clientY: e.clientY,
                        screenX: e.screenX,
                        screenY: e.screenY,
                        timestamp: Date.now()
                    }
                })
            }
        }}
        onMouseEnter={() => setProps({ mouseEnterCount: mouseEnterCount + 1 })}
        onMouseLeave={() => setProps({ mouseLeaveCount: mouseLeaveCount + 1 })}
        tabIndex={enableFocus ? 0 : undefined}
        data-dash-is-loading={
            (loading_state && loading_state.is_loading) || undefined
        } >
        {children}
    </ div>;
}

// 定义参数或属性
FefferyDiv.propTypes = {
    /**
     * 组件id
     */
    id: PropTypes.string,

    /**
     * 强制刷新用
     */
    key: PropTypes.string,

    /**
     * 组件子元素
     */
    children: PropTypes.node,

    /**
     * 自定义css字典
     */
    style: PropTypes.object,

    /**
     * css类名
     */
    className: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),

    /**
     * 监听容器像素宽度变化
     */
    _width: PropTypes.number,

    /**
     * 监听容器像素高度变化
     */
    _height: PropTypes.number,

    /**
     * 设置针对尺寸变化事件的防抖等待时间（单位：毫秒），默认为150
     */
    debounceWait: PropTypes.number,

    /**
     * 监听鼠标移入事件次数，初始化为0
     */
    mouseEnterCount: PropTypes.number,

    /**
     * 监听鼠标移出事件次数，初始化为0
     */
    mouseLeaveCount: PropTypes.number,

    /**
     * 监听单击事件次数，初始化为0
     */
    nClicks: PropTypes.number,

    /**
     * 监听双击事件次数，初始化为0
     */
    nDoubleClicks: PropTypes.number,

    /**
     * 设置是否针对当前div监听右键点击事件，开启后会强制关闭当前div内的默认右键菜单弹出
     * 默认为false
     */
    enableListenContextMenu: PropTypes.bool,

    /**
     * 监听右键事件
     */
    contextMenuEvent: PropTypes.exact({
        /**
         * 以页面整体左上角为原点，记录x坐标
         */
        pageX: PropTypes.number,
        /**
         * 以页面整体左上角为原点，记录y坐标
         */
        pageY: PropTypes.number,
        /**
         * 以浏览器窗口左上角为原点，记录x坐标
         */
        clientX: PropTypes.number,
        /**
         * 以浏览器窗口左上角为原点，记录y坐标
         */
        clientY: PropTypes.number,
        /**
         * 以屏幕左上角为原点，记录x坐标
         */
        screenX: PropTypes.number,
        /**
         * 以屏幕左上角为原点，记录y坐标
         */
        screenY: PropTypes.number,
        /**
         * 点击事件对应的时间戳
         */
        timestamp: PropTypes.number
    }),

    /**
     * 监听当前元素是否被鼠标悬浮
     */
    isHovering: PropTypes.bool,

    /**
     * 设置是否启用元素外点击事件监听，当页面中有大量FefferyDiv元素时，建议不要开启此特性，会导致明显的性能问题
     * 默认为false
     */
    enableClickAway: PropTypes.bool,

    /**
     * 监听元素外点击事件发生次数，默认为0
     */
    clickAwayCount: PropTypes.number,

    /**
     * 监听当前元素左上角在视口中的坐标位置
     */
    position: PropTypes.exact({
        /**
         * 以页面整体左上角为原点，记录x坐标
         */
        x: PropTypes.number,
        /**
         * 以页面整体左上角为原点，记录y坐标
         */
        y: PropTypes.number,
    }),

    /**
     * 是否启用聚焦状态监听功能
     * 默认：false
     */
    enableFocus: PropTypes.bool,

    /**
     * 监听或设置当前元素是否聚焦
     */
    isFocused: PropTypes.bool,

    /**
     * 设置当前div内部处理鼠标滑轮事件的策略
     * 可选的有'default'、'internally-only'（不向外传递）
     * 默认：'default'
     */
    wheelEventStrategy: PropTypes.oneOf(['default', 'internally-only']),

    /**
     * 设置当前容器的快捷阴影效果，可选的有'no-shadow'、'hover-shadow'、'always-shadow'
     * 默认为'no-shadow'
     */
    shadow: PropTypes.oneOf([
        'no-shadow',
        'hover-shadow',
        'always-shadow',
        'hover-shadow-light',
        'always-shadow-light'
    ]),

    /**
     * 设置当前容器的快捷滚动条美化效果，可选的有'default'、'simple'、'hidden'
     */
    scrollbar: PropTypes.oneOf(['default', 'simple', 'hidden']),

    /**
     * text-align快捷设置
     */
    textAlign: PropTypes.oneOf(['left', 'center', 'right']),

    /**
     * 针对flex布局的justify-content快捷设置
     * 传入有效值后会自动开启flex布局
     */
    justify: PropTypes.string,

    /**
     * 针对flex布局的align-items快捷设置
     * 传入有效值后会自动开启flex布局
     */
    align: PropTypes.string,

    /**
     * padding快捷设置
     */
    padding: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    /**
     * margin快捷设置
     */
    margin: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    /**
     * border快捷设置
     */
    border: PropTypes.string,

    /**
     * border-radius快捷设置
     */
    borderRadius: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,

    loading_state: PropTypes.shape({
        /**
         * Determines if the component is loading or not
         */
        is_loading: PropTypes.bool,
        /**
         * Holds which property is loading
         */
        prop_name: PropTypes.string,
        /**
         * Holds the name of the component that is loading
         */
        component_name: PropTypes.string
    })
};

// 设置默认参数
FefferyDiv.defaultProps = {
    mouseEnterCount: 0,
    mouseLeaveCount: 0,
    nClicks: 0,
    nDoubleClicks: 0,
    enableListenContextMenu: false,
    debounceWait: 150,
    clickAwayCount: 0,
    shadow: 'no-shadow',
    scrollbar: 'default',
    enableClickAway: false,
    enableFocus: false,
    wheelEventStrategy: 'default'
}

export default FefferyDiv;