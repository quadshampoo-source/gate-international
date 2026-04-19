import Link from 'next/link';
import { register } from './actions';

export default async function RegisterPage({ searchParams }) {
  const sp = await searchParams;
  const err = sp?.error;
  const success = sp?.success === '1';

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-[480px] border border-line bg-bg-raised p-10 text-center">
          <div className="admin-brand mb-6">GATE <em>·</em> ADMIN</div>
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center text-gold mx-auto mb-6 text-2xl">✓</div>
          <h1 className="font-serif text-[26px] mb-4">Registration received</h1>
          <p className="text-fg-muted text-[14px] leading-relaxed mb-6">
            Your account is awaiting approval. The Gate International team will review your
            request and contact you shortly. You will not be able to sign in until an
            administrator activates your account.
          </p>
          <Link href="/admin/login" className="admin-btn secondary inline-block">Return to sign in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <form action={register} className="w-full max-w-[480px] border border-line bg-bg-raised p-8">
        <div className="admin-brand mb-6">GATE <em>·</em> ADMIN</div>
        <h1 className="font-serif text-[28px] mb-2 tracking-tight">Request access</h1>
        <p className="text-fg-muted text-[13px] mb-8">
          Partners, brokers and editors — submit your details below. Our team reviews every
          request individually and assigns the relevant projects.
        </p>

        <Field label="Full name" name="full_name" required />
        <Field label="Company" name="company" />
        <Field label="Phone" name="phone" type="tel" placeholder="+90 …" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Password" name="password" type="password" required minLength={8} />

        {err && (
          <div className="text-[#ef4444] text-[13px] mb-4">
            {err === 'missing'
              ? 'Please fill all required fields.'
              : err === 'short'
              ? 'Password must be at least 8 characters.'
              : decodeURIComponent(err)}
          </div>
        )}

        <button className="admin-btn w-full mt-2" type="submit">Submit registration</button>

        <div className="text-center mt-6 text-[12px] text-fg-muted">
          Already approved? <Link href="/admin/login" className="text-gold hover:underline">Sign in</Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = 'text', required, placeholder, minLength }) {
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-mono tracking-[0.18em] uppercase text-fg-muted mb-2">
        {label}{required && ' *'}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
        className="admin-input"
      />
    </div>
  );
}
