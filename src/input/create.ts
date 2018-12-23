/**
 * 构造统一的touchEvent格式
 */
import { Input } from '../interface';
import { SUPPORT_ONLY_TOUCH, IS_MOBILE, INPUT_CANCEL, INPUT_END, INPUT_MOVE, INPUT_START } from '../const';
import { getCenter } from '../vector';
import touchAdapter from './adapters/touch'
import mouseAdapter from './adapters/mouse';
let centerX: number;
let centerY: number;

export default (event: TouchEvent | MouseEvent): Input => {
    let input: any = {};
    // Touch
    if (IS_MOBILE) {
        input = touchAdapter(<TouchEvent>event);
    }
    // Mouse
    else {
        input = mouseAdapter(<MouseEvent>event);
        if (undefined === input) {
            return;
        }
    }
    const { inputStatus, pointers, changedPointers } = input;
    // 当前触点数
    const pointerLength: number = pointers.length;

    // 变化前触点数
    const changedPointerLength: number = changedPointers.length;
    const isFirst = (INPUT_START === inputStatus) && (0 === changedPointerLength - pointerLength);
    const isFinal = (INPUT_END === inputStatus) && (0 === pointerLength);

    // 中心坐标
    if (0 < pointerLength) {
        const { x, y } = getCenter(input.pointers);
        centerX = x;
        centerY = y;
    }

    // 当前时间
    const timestamp = Date.now();

    // 原生属性/方法
    const { target, currentTarget } = event;

    // 阻止冒泡
    const stopPropagation = () => {
        event.stopPropagation();
    };

    // 阻止默认默认事件
    const preventDefault = () => {
        if (event.cancelable) {
            event.preventDefault();
        }
    };

    // 阻止其他事件
    const stopImmediatePropagation = () => {
        event.stopImmediatePropagation();
    }

    return {
        ...input,
        isFirst,
        isFinal,
        stopPropagation,
        preventDefault,
        stopImmediatePropagation,
        pointerLength,
        changedPointerLength,
        centerX,
        centerY,
        x: centerX,
        y: centerY,
        timestamp,
        target,
        currentTarget,
        nativeEvent: event
    };
}