import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { formatXOF } from '../../data/products';
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  Mail,
  Send,
  ExternalLink
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Generate clean canonical URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/montres/${product.slug}`
    : `https://heritageboutique.ci/montres/${product.slug}`;

  const shareTitle = `${product.brand} - ${product.name} | HERITAGE Abidjan`;
  const shareText = `Découvrez la montre d'exception ${product.brand} ${product.name} (Réf. ${product.reference}) disponible à Abidjan chez HERITAGE.`;

  useEffect(() => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, []);

  // Keyboard close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        onClose();
      } catch {
        // Share cancelled or failed, ignore
      }
    }
  };

  // Social sharing endpoints
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const mailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nConsulter la fiche détaillée : ${shareUrl}`)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002141]/75 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg border border-[#002141]/15 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fenêtre de partage"
          className="absolute top-4 right-4 p-2 text-[#002141]/60 hover:text-[#002141] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#AC854B] mb-1.5">
            <Share2 className="w-3.5 h-3.5" />
            <span>PARTAGE & TRANSMISSION</span>
          </div>
          <h2 id="share-modal-title" className="font-playfair text-2xl font-bold text-[#002141]">
            Partager cette pièce
          </h2>
          <p className="text-xs text-[#4A4A4A] mt-1">
            Faites découvrir cette référence d'exception à vos proches ou sur vos réseaux.
          </p>
        </div>

        {/* Product Mini Preview Card */}
        <div className="flex items-center gap-4 p-3 bg-[#FAF9F7] border border-[#002141]/10 mb-6">
          <div className="w-14 h-16 bg-white border border-[#002141]/10 p-1 flex items-center justify-center shrink-0">
            <img
              src={product.primaryImage}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC854B] block truncate">
              {product.brand} &middot; Réf. {product.reference}
            </span>
            <h3 className="font-playfair text-sm font-bold text-[#002141] truncate">
              {product.name}
            </h3>
            <span className="text-xs font-bold text-[#002141]">
              {formatXOF(product.priceXOF)}
            </span>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="mb-6">
          <label htmlFor="share-link-input" className="block text-xs font-semibold text-[#002141] uppercase tracking-wider mb-2">
            Lien direct de la pièce
          </label>
          <div className="flex items-center gap-2">
            <input
              id="share-link-input"
              type="text"
              readOnly
              value={shareUrl}
              className="w-full px-3.5 py-2.5 bg-[#FAF9F7] border border-[#002141]/20 text-xs text-[#002141] focus:outline-none select-all font-mono"
            />
            <button
              type="button"
              id="share-copy-button"
              onClick={handleCopyLink}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#002141] hover:bg-[#AC854B] text-[#FAF9F7]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-700 font-medium mt-1.5 flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Le lien a été copié dans votre presse-papiers avec succès.</span>
            </p>
          )}
        </div>

        {/* Social Networks Share Grid */}
        <div className="mb-6">
          <span className="block text-xs font-semibold text-[#002141] uppercase tracking-wider mb-3">
            Partager via vos réseaux
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 bg-[#FAF9F7] hover:bg-emerald-50 border border-[#002141]/10 hover:border-emerald-300 text-[#002141] hover:text-emerald-800 transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="font-semibold">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 bg-[#FAF9F7] hover:bg-blue-50 border border-[#002141]/10 hover:border-blue-300 text-[#002141] hover:text-blue-800 transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <span className="font-semibold">Facebook</span>
            </a>

            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 bg-[#FAF9F7] hover:bg-zinc-100 border border-[#002141]/10 hover:border-zinc-300 text-[#002141] transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                <span className="font-bold text-xs">X</span>
              </div>
              <span className="font-semibold">X (Twitter)</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 bg-[#FAF9F7] hover:bg-sky-50 border border-[#002141]/10 hover:border-sky-300 text-[#002141] hover:text-sky-800 transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#24A1DE] text-white flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">Telegram</span>
            </a>

            {/* Email */}
            <a
              href={mailUrl}
              className="flex items-center gap-2.5 p-3 bg-[#FAF9F7] hover:bg-amber-50 border border-[#002141]/10 hover:border-amber-300 text-[#002141] hover:text-[#AC854B] transition-colors text-xs font-medium cursor-pointer col-span-2 sm:col-span-2"
            >
              <div className="w-7 h-7 rounded-full bg-[#002141] text-[#FAF9F7] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-semibold">Transmettre par e-mail</span>
            </a>
          </div>
        </div>

        {/* Native Web Share Button (Mobile / Supported systems) */}
        {canNativeShare && (
          <div className="pt-4 border-t border-[#002141]/10">
            <button
              type="button"
              id="share-native-button"
              onClick={handleNativeShare}
              className="w-full py-3 bg-[#FAF9F7] hover:bg-[#002141] text-[#002141] hover:text-[#FAF9F7] border border-[#002141]/20 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Autres applications (Partage système)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
