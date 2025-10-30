import { EmailOptions } from './types';
export declare class EmailService {
    private readonly logger;
    private createMailer;
    sendEmail(opts: EmailOptions): Promise<void>;
}
