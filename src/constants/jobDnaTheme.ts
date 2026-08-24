export const JOB_DNA_COLORS = {
  pageBg: '#fffbf0',       
  panelBg: '#fffdfa',
  cardBg: '#fff6e0',    
  text: '#1e1409',     
  textSecondary: '#6e5c4d',  
  textTertiary: '#b8a694',  
  accent: '#ffab00',        
  accentHover: '#e09600',   
  textOnAccent: '#1e1409',  
  border: '#ebdccb',          
  success: '#ffab00',
  danger: '#ef4444',
  dangerBg: '#fef2f2',      
};

// 오행(五行) 브랜드 테마 컬러 배정
const OHAENG_THEMES: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  '木': { bg: '#f0fdf4', border: 'rgba(34, 197, 94, 0.4)', text: '#166534', badge: '#22c55e' },
  '火': { bg: '#fff1f2', border: 'rgba(244, 63, 94, 0.4)', text: '#9f1239', badge: '#f43f5e' },
  '土': { bg: '#fffbeb', border: 'rgba(245, 158, 11, 0.4)', text: '#92400e', badge: '#f59e0b' },
  '金': { bg: '#f8fafc', border: 'rgba(100, 116, 139, 0.4)', text: '#334155', badge: '#64748b' },
  '水': { bg: '#f0f9ff', border: 'rgba(2, 132, 199, 0.4)', text: '#075985', badge: '#0284c7' },
};

export const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
} as const;