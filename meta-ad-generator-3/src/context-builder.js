export function buildClientContext(brief, brandAssets = {}) {
  const colors = brandAssets.colors || {};
  const fonts = brandAssets.fonts || {};

  return {
    business_name: brief.business_name || brief.client_name || brief.name || 'the business',
    product: brief.product || brief.offer || brief.service || brief.product_description || '',
    product_type: brief.product_type || 'intangible',
    audience: brief.target_audience || brief.audience || '',
    pain_points: toArray(brief.pain_points),
    key_benefits: toArray(brief.key_benefits || brief.benefits),
    proof_points: toArray(brief.proof_points || brief.social_proof || brief.credentials),
    unique_value: brief.unique_value_proposition || brief.uvp || brief.unique_selling_point || '',
    price: brief.price || brief.offer_price || brief.pricing || null,
    language: brief.language || 'en',
    tone: brief.tone || brief.voice || 'professional yet conversational',
    cta_primary: brief.cta_primary || null,
    extra_context: brief.extra_context || brief.notes || '',

    // Brand
    primary_color: colors.primary || '#1a1a1a',
    secondary_color: colors.secondary || '#ffffff',
    accent_color: colors.accent || '#c8a96e',
    primary_font: fonts.primary || 'Georgia, serif',
    heading_font: fonts.heading || fonts.primary || 'Georgia, serif',
    logo_url: brandAssets.logo || brandAssets.logo_url || null,
    hero_images: brandAssets.images || brandAssets.hero_images || [],
  };
}

export function formatContextForPrompt(ctx) {
  const lines = [
    `Business: ${ctx.business_name}`,
    `Product/Offer: ${ctx.product}`,
    `Product Type: ${ctx.product_type} (${ctx.product_type === 'tangible' ? 'physical product' : 'service or digital product'})`,
    `Target Audience: ${ctx.audience}`,
    ctx.pain_points.length ? `Pain Points: ${ctx.pain_points.join('; ')}` : null,
    ctx.key_benefits.length ? `Key Benefits: ${ctx.key_benefits.join('; ')}` : null,
    ctx.proof_points.length ? `Proof Points: ${ctx.proof_points.join('; ')}` : null,
    ctx.unique_value ? `Unique Value: ${ctx.unique_value}` : null,
    ctx.price ? `Price/Offer: ${ctx.price}` : null,
    `Language: ${ctx.language}`,
    `Brand Tone: ${ctx.tone}`,
    ctx.cta_primary ? `Preferred CTA text: "${ctx.cta_primary}" — use this exact wording for the cta field` : null,
    ctx.extra_context ? `Extra Context: ${ctx.extra_context}` : null,
  ].filter(Boolean);

  return lines.join('\n');
}

function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') return val.split(/[,;]\s*/).filter(Boolean);
  return [];
}
