import logo from '@/assets/smart-bag-logo-a-trim.png';

export function SmartBagBrand({ compact = false }: { compact?: boolean }) {
  return <span className={`smart-brand ${compact ? 'compact' : ''}`}><img src={logo} alt="" width={42} height={48} /><span>SMART<span className="brand-light"> BAG</span></span></span>;
}