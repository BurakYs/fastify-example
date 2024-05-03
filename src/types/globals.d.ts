import { Logger } from '@/helpers';
import { ILogObj } from 'tslog';

declare global {
    var logger: Logger<ILogObj>;
}