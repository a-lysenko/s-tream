import {EventEmitter} from 'node:events'

export function main() {
    const evem = new EventEmitter();
    evem.on('go', () => console.log('Go run ga go!'));
    evem.on(
        'ga',
        () => setTimeout(() => console.log('Delayed Go run ga go!'), 2000)
    );

    evem.emit('ga');
    evem.emit('go');

}
