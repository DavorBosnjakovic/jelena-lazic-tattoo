// jela-website/src/components/contact/GoogleMap.tsx

'use client'

export default function GoogleMap() {
  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg border border-border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2830.4857777777777!2d20.4612!3d44.8125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDQ4JzQ1LjAiTiAyMMKwMjcnNDAuMyJF!5e0!3m2!1sen!2srs!4v1234567890"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Jelena Lazić Tattoo Studio Location - Belgrade, Serbia"
      />
    </div>
  )
}