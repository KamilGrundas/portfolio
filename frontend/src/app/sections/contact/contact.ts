import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Contact {
  private fb = new FormBuilder();

  // lokalny stan jako signals
  submitting = signal(false);
  sent = signal(false);

  form = this.fb.nonNullable.group({
    name:    this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    email:   this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    message: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(10)]),
  });

  async submit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return;
    this.submitting.set(true);
    this.sent.set(false);

    // TODO: podłącz prawdziwe API (np. email service / webhook).
    // Tu tylko symulacja wysyłki:
    await new Promise(r => setTimeout(r, 600));

    const payload: ContactFormData = this.form.getRawValue();
    console.info('[Contact] Submitted:', payload);

    this.form.reset();
    this.sent.set(true);
    this.submitting.set(false);
  }
}
