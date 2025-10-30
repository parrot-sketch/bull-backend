import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as nodemailer from 'nodemailer';
import { EmailOptions, EmailTransportOptions } from './types';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private createMailer(): nodemailer.Transporter | null {
    const emailService = (process.env.EMAIL_SERVICE || '').toLowerCase();
    if (emailService === 'sendgrid') {
      return null; // Signal to use SendGrid SDK
    }

    const host = process.env.SMTP_HOST || 'localhost';
    const port = parseInt(process.env.SMTP_PORT || '1025', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const transportOptions: EmailTransportOptions = { host, port };
    if (user && pass) {
      transportOptions.auth = { user, pass };
      transportOptions.secure = Number(port) === 465;
    }

    this.logger.debug(`Creating SMTP transport for ${host}:${port}`);
    return nodemailer.createTransport(transportOptions);
  }

  async sendEmail(opts: EmailOptions): Promise<void> {
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
      } catch (err) {
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
    } catch (err) {
      this.logger.error('SMTP send failed:', err);
      throw err;
    }
  }
}