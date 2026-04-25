'use client';

import { useEffect, useRef, useState } from 'react';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;

function fileError(file) {
  if (!file) return null;
  if (file.size > MAX_BYTES) return 'Image exceeds 8 MB.';
  if (!ALLOWED.includes(file.type)) return 'Image must be JPEG, PNG or WebP.';
  return null;
}

export default function HeroForm({ action, initial }) {
  const [version, setVersion] = useState(initial.heroVersion || 'v1');
  const [opacity, setOpacity] = useState(
    initial.heroOverlayOpacity != null ? Number(initial.heroOverlayOpacity) : 0.4,
  );

  // For preview purposes the URL state is either:
  //  - existing saved URL (string)
  //  - blob: URL from a freshly-picked File
  //  - null when cleared
  const [desktopUrl, setDesktopUrl] = useState(initial.heroImageUrl || null);
  const [mobileUrl, setMobileUrl] = useState(initial.heroImageMobileUrl || null);
  const [desktopErr, setDesktopErr] = useState(null);
  const [mobileErr, setMobileErr] = useState(null);
  // Hidden flags toggled by the "Remove" buttons.
  const [clearDesktop, setClearDesktop] = useState(false);
  const [clearMobile, setClearMobile] = useState(false);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  // Revoke blob URLs when they're replaced — Memory Leak 101.
  const lastBlobs = useRef({ desktop: null, mobile: null });
  useEffect(() => () => {
    if (lastBlobs.current.desktop) URL.revokeObjectURL(lastBlobs.current.desktop);
    if (lastBlobs.current.mobile) URL.revokeObjectURL(lastBlobs.current.mobile);
  }, []);

  const onPick = (slot) => (e) => {
    const file = e.target.files?.[0];
    const err = fileError(file);
    if (slot === 'desktop') {
      setDesktopErr(err);
      if (err) { e.target.value = ''; return; }
      if (lastBlobs.current.desktop) URL.revokeObjectURL(lastBlobs.current.desktop);
      const blob = file ? URL.createObjectURL(file) : null;
      lastBlobs.current.desktop = blob;
      setDesktopUrl(blob);
      setClearDesktop(false);
    } else {
      setMobileErr(err);
      if (err) { e.target.value = ''; return; }
      if (lastBlobs.current.mobile) URL.revokeObjectURL(lastBlobs.current.mobile);
      const blob = file ? URL.createObjectURL(file) : null;
      lastBlobs.current.mobile = blob;
      setMobileUrl(blob);
      setClearMobile(false);
    }
  };

  const onRemove = (slot) => () => {
    if (slot === 'desktop') {
      if (lastBlobs.current.desktop) URL.revokeObjectURL(lastBlobs.current.desktop);
      lastBlobs.current.desktop = null;
      setDesktopUrl(null);
      setClearDesktop(true);
      if (desktopInputRef.current) desktopInputRef.current.value = '';
    } else {
      if (lastBlobs.current.mobile) URL.revokeObjectURL(lastBlobs.current.mobile);
      lastBlobs.current.mobile = null;
      setMobileUrl(null);
      setClearMobile(true);
      if (mobileInputRef.current) mobileInputRef.current.value = '';
    }
  };

  const showV2Fields = version === 'v2';
  const previewUrl = desktopUrl || mobileUrl || null;

  return (
    <form action={action} encType="multipart/form-data" className="max-w-[860px]">
      {/* Hidden flags consumed by the server action. */}
      <input type="hidden" name="clear_desktop" value={clearDesktop ? '1' : '0'} />
      <input type="hidden" name="clear_mobile" value={clearMobile ? '1' : '0'} />

      {/* Live preview pane */}
      <div
        className="relative overflow-hidden border border-line mb-6"
        style={{ aspectRatio: '21 / 9', background: '#0F1624' }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.32) 0%, rgba(99,102,241,0) 70%), radial-gradient(50% 60% at 80% 20%, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0) 70%)',
            }}
          />
        )}
        {showV2Fields && previewUrl && (
          <div
            className="absolute inset-0"
            style={{ background: '#000', opacity }}
            aria-hidden
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div
            className="text-[11px] font-mono tracking-[0.18em] uppercase mb-3"
            style={{ color: showV2Fields && previewUrl ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.55)' }}
          >
            Live preview · {version}
          </div>
          <div
            className="font-serif"
            style={{
              fontSize: 28,
              lineHeight: 1.1,
              color: showV2Fields && previewUrl ? '#fff' : 'rgba(255,255,255,0.85)',
              textShadow: showV2Fields && previewUrl ? '0 2px 18px rgba(0,0,0,0.4)' : 'none',
            }}
          >
            Premium Turkish residences,{' '}
            <em style={{ color: '#FF6B5C', fontStyle: 'italic' }}>sourced privately.</em>
          </div>
        </div>
      </div>

      {/* Version radios */}
      <fieldset className="mb-8">
        <legend className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mb-3">
          Hero Version
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <VersionCard
            value="v1"
            checked={version === 'v1'}
            onChange={() => setVersion('v1')}
            label="Klasik (gradient)"
            sub="Mevcut hero — gradient aura, primary renkler. Site varsayılanı."
          />
          <VersionCard
            value="v2"
            checked={version === 'v2'}
            onChange={() => setVersion('v2')}
            label="Görsel arka plan"
            sub="Full-bleed fotoğraf + dark overlay. Görsel yüklenmemişse otomatik v1'e döner."
          />
        </div>
      </fieldset>

      {/* v2-only fields */}
      {showV2Fields && (
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ImageSlot
              label="Desktop image"
              hint="JPEG / PNG / WebP, ≤ 8 MB. Önerilen: 2560×1440 veya benzeri 16:9 / 21:9."
              name="image_desktop"
              currentUrl={desktopUrl}
              error={desktopErr}
              onPick={onPick('desktop')}
              onRemove={onRemove('desktop')}
              inputRef={desktopInputRef}
            />
            <ImageSlot
              label="Mobile image (optional)"
              hint="Boşsa desktop görseli mobilde de kullanılır. Önerilen: 1080×1920 (9:16)."
              name="image_mobile"
              currentUrl={mobileUrl}
              error={mobileErr}
              onPick={onPick('mobile')}
              onRemove={onRemove('mobile')}
              inputRef={mobileInputRef}
            />
          </div>

          <div className="admin-row">
            <label htmlFor="opacity">Overlay opacity</label>
            <div>
              <div className="flex items-center gap-4">
                <input
                  id="opacity"
                  name="hero_overlay_opacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="font-mono text-[12px] text-fg-muted w-12 text-right">
                  {opacity.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-fg-dim mt-2">
                Görselin üzerindeki siyah katmanın koyuluğu. Yazı okunabilirliği için 0.35–0.55 arası önerilir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden opacity input ensures the field is submitted even when v2
          UI is collapsed (so it's preserved on accidental v1 toggle). */}
      {!showV2Fields && (
        <input type="hidden" name="hero_overlay_opacity" value={opacity} />
      )}
      <input type="hidden" name="hero_version" value={version} />

      <div className="flex items-center gap-3 flex-wrap">
        <button type="submit" className="admin-btn">Save hero</button>
        <a
          href={`/en?preview_hero=${version}`}
          target="_blank"
          rel="noreferrer"
          className="admin-btn secondary"
        >
          Yeni sekmede önizle →
        </a>
      </div>
    </form>
  );
}

function VersionCard({ value, checked, onChange, label, sub }) {
  return (
    <label
      className={`block p-5 border cursor-pointer transition-colors ${
        checked ? 'border-gold bg-gold/10' : 'border-line bg-bg-raised hover:border-gold/40'
      }`}
    >
      <input
        type="radio"
        name="hero_version_radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="flex items-center justify-between mb-2">
        <span className="font-serif text-[18px]">{label}</span>
        {checked && <span className="text-gold text-xs font-mono">ACTIVE</span>}
      </div>
      <p className="text-fg-muted text-[12px] leading-relaxed">{sub}</p>
    </label>
  );
}

function ImageSlot({ label, hint, name, currentUrl, error, onPick, onRemove, inputRef }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-muted mb-2">
        {label}
      </div>
      <div
        className="relative border border-line mb-3"
        style={{ aspectRatio: '16 / 9', background: '#0B1220' }}
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-fg-dim text-[11px] font-mono">
            no image
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp"
        onChange={onPick}
        className="text-[12px] text-fg-muted block"
      />
      {error && <p className="text-[12px] text-[#ef4444] mt-2">{error}</p>}
      <p className="text-[11px] text-fg-dim mt-2">{hint}</p>
      {currentUrl && (
        <button
          type="button"
          onClick={onRemove}
          className="admin-btn danger mt-3"
        >
          Remove
        </button>
      )}
    </div>
  );
}
