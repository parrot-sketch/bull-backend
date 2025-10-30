"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
    }
    createMailer() {
        const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();
        if (emailService === 'sendgrid') {
            return null;
        }
        const host = process.env.SMTP_HOST || 'localhost';
        const port = parseInt(process.env.SMTP_PORT || '1025', 10);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const transportOptions = { host, port };
        if (user && pass) {
            transportOptions.auth = { user, pass };
            transportOptions.secure = Number(port) === 465;
        }
        this.logger.debug(`Creating SMTP transport for ${host}:${port}`);
        return nodemailer.createTransport(transportOptions);
    }
    async sendEmail(opts) {
        const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();
        this.logger.debug(`Sending email using ${emailService} service`);
        if (emailService === 'sendgrid') {
            const sendgridKey = process.env.SENDGRID_API_KEY;
            if (!sendgridKey) {
                this.logger.error('EMAIL_SERVICE=sendgrid but SENDGRID_API_KEY is not set');
                throw new Error('SendGrid API key not configured');
            }
            try {
                sgMail.setApiKey(sendgridKey);
                await sgMail.send({
                    to: opts.to,
                    from: opts.from,
                    subject: opts.subject,
                    text: opts.text,
                    html: opts.html,
                });
                this.logger.debug('SendGrid email sent successfully');
                return;
            }
            catch (err) {
                this.logger.error('SendGrid send failed:', err);
                throw err;
            }
        }
        try {
            const transporter = this.createMailer();
            if (!transporter) {
                throw new Error('SMTP transporter not available');
            }
            await transporter.sendMail(opts);
            this.logger.debug('SMTP email sent successfully');
        }
        catch (err) {
            this.logger.error('SMTP send failed:', err);
            throw err;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)()
], EmailService);
//# sourceMappingURL=email.service.js.map