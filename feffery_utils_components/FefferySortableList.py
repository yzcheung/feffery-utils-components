# AUTO GENERATED FILE - DO NOT EDIT

from dash.development.base_component import Component, _explicitize_args


class FefferySortableList(Component):
    """A FefferySortableList component.


Keyword arguments:

- id (string; optional):
    部件id.

- className (string | dict; optional):
    组件css类.

- currentOrder (list of number | strings; optional):
    监听当前items顺序对应的子项id数组.

- direction (a value equal to: 'vertical', 'horizontal'; default 'vertical'):
    设置排序列表的方向，可选的有'vertical'和'horizontal'  默认：'vertical'.

- handleClassName (string | dict; optional):
    拖拽手柄css类.

- handlePosition (a value equal to: 'start', 'end'; default 'end'):
    设置拖拽手柄位置，默认为'end'.

- handleStyle (dict; optional):
    拖拽手柄css样式.

- handleType (a value equal to: 'holder', 'menu', 'drag'; default 'holder'):
    设置内置的推拽手柄图标类型，默认为'holder'.

- itemDraggingScale (number; default 1):
    设置子项处于拖拽中状态下的缩放比例，默认为1即不缩放.

- items (list of dicts; required):
    必填参数，用于定义当前排序列表组件的各子元素.

    `items` is a list of dicts with keys:

    - className (string | dict; optional):
        当前子元素容器css类.

    - content (a list of or a singular dash component, string or number; optional):
        当前子元素内容.

    - draggingClassName (string | dict; optional):
        当前子元素处于拖拽中状态下的css类.

    - draggingStyle (dict; optional):
        当前子元素处于拖拽中状态下的css样式.

    - key (number | string; required):
        对应当前子元素的唯一标识.

    - style (dict; optional):
        当前子元素容器css样式.

- key (string; optional)

- loading_state (dict; optional)

    `loading_state` is a dict with keys:

    - component_name (string; optional):
        Holds the name of the component that is loading.

    - is_loading (boolean; optional):
        Determines if the component is loading or not.

    - prop_name (string; optional):
        Holds which property is loading.

- style (dict; optional):
    组件css样式."""
    _children_props = ['items[].content']
    _base_nodes = ['children']
    _namespace = 'feffery_utils_components'
    _type = 'FefferySortableList'
    @_explicitize_args
    def __init__(self, id=Component.UNDEFINED, style=Component.UNDEFINED, handleStyle=Component.UNDEFINED, handleClassName=Component.UNDEFINED, className=Component.UNDEFINED, key=Component.UNDEFINED, items=Component.REQUIRED, direction=Component.UNDEFINED, itemDraggingScale=Component.UNDEFINED, handlePosition=Component.UNDEFINED, handleType=Component.UNDEFINED, currentOrder=Component.UNDEFINED, loading_state=Component.UNDEFINED, **kwargs):
        self._prop_names = ['id', 'className', 'currentOrder', 'direction', 'handleClassName', 'handlePosition', 'handleStyle', 'handleType', 'itemDraggingScale', 'items', 'key', 'loading_state', 'style']
        self._valid_wildcard_attributes =            []
        self.available_properties = ['id', 'className', 'currentOrder', 'direction', 'handleClassName', 'handlePosition', 'handleStyle', 'handleType', 'itemDraggingScale', 'items', 'key', 'loading_state', 'style']
        self.available_wildcard_properties =            []
        _explicit_args = kwargs.pop('_explicit_args')
        _locals = locals()
        _locals.update(kwargs)  # For wildcard attrs and excess named props
        args = {k: _locals[k] for k in _explicit_args}

        for k in ['items']:
            if k not in args:
                raise TypeError(
                    'Required argument `' + k + '` was not specified.')

        super(FefferySortableList, self).__init__(**args)
