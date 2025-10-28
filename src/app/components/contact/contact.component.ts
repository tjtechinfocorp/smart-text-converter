import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SEOService } from '../../services/seo.service';
import { TranslationService } from '../../services/translation.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../config/emailjs.config';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  private seoService = inject(SEOService);
  private translationService = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Set language to English by default
      this.translationService.setLanguage('en');

      // Scroll to top
      window.scrollTo(0, 0);

      // Initialize EmailJS
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

      // Set SEO meta tags
      this.seoService.setMetaTags({
        title: 'Contact Us - Smart Text Converter | Get Help & Support',
        description:
          'Contact Smart Text Converter for support, feedback, or questions. Get help with our text conversion tools, report issues, or suggest new features.',
        keywords:
          'contact us, support, help, feedback, text converter support, customer service, technical support',
        canonicalUrl: 'https://smarttextconverter.com/contact',
        imageUrl: '/main-logo-80x80.png',
      });

      // Add structured data for Contact page
      this.addStructuredData();
    }

    // Initialize contact form
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      type: ['general', Validators.required],
    });
  }

  private addStructuredData() {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Us - Smart Text Converter',
      description:
        'Contact Smart Text Converter for support, feedback, or questions about our text conversion tools.',
      url: 'https://smarttextconverter.com/contact',
      mainEntity: {
        '@type': 'Organization',
        name: 'Smart Text Converter',
        url: 'https://smarttextconverter.com',
        logo: '/main-logo-80x80.png',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: 'support@smarttextconverter.com',
          availableLanguage: ['English'],
        },
      },
    };

    this.seoService.addStructuredData(structuredData);
  }

  async onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';
      this.submitSuccess = false;

      try {
        // Prepare email template parameters
        const templateParams = {
          from_name: this.contactForm.value.name,
          from_email: this.contactForm.value.email,
          subject: this.contactForm.value.subject,
          message: this.contactForm.value.message,
          message_type: this.contactForm.value.type,
          to_email: 'tjtechinfocorp@gmail.com',
        };

        // Send email using EmailJS
        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams
        );

        if (response.status === 200) {
          this.submitSuccess = true;
          this.submitMessage = "Thank you for your message! We'll get back to you within 24 hours.";
          this.contactForm.reset();
          this.contactForm.patchValue({ type: 'general' });
        } else {
          throw new Error('Email sending failed');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        this.submitSuccess = false;
        this.submitMessage =
          'Sorry, there was an error sending your message. Please try again or contact us directly at contactvpatel@gmail.com';
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.submitSuccess = false;
      this.submitMessage = 'Please fill in all required fields correctly.';
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too short`;
      }
    }
    return '';
  }
}
