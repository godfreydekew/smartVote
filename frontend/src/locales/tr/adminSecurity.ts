export const adminSecurity = {
  auditLogDetails: 'Denetim Günlüğü Detayları',
  securityBreachDetails: 'Güvenlik İhlali Detayları',
  electionId: 'Seçim ID',
  checkTime: 'Kontrol Zamanı',
  detectedAt: 'Tespit Edildi',
  databaseVotes: 'Veritabanı Oyları',
  blockchainVotes: 'Blockchain Oyları',
  databaseStatus: 'Veritabanı Durumu',
  blockchainStatus: 'Blockchain Durumu',
  issueTypes: 'Sorun Türleri',
  status: 'Durum',
  issueDetails: 'Sorun Detayları',
  auditSummary: 'Denetim Özeti',
  securityViolations: 'Güvenlik İhlalleri',
  rawDetails: 'Ham Detaylar',
  totalChecks: 'Toplam Kontrol',
  passed: 'Geçti',
  failed: 'Başarısız',
  passRate: 'Başarı Oranı',
  resolved: 'Çözüldü',
  active: 'Aktif',
  securityIssuesDetected: '⚠️ Güvenlik Sorunları Tespit Edildi',
  securityIssuesDescription: 'Bu denetim dikkat gerektiren {count} güvenlik sorunu buldu.',
  resolvedAt: 'Çözüldü: {date}',

  overviewCards: {
    totalAudits: 'Toplam Denetim',
    activeBreaches: 'Aktif İhlaller',
    resolved: 'Çözüldü',
    lastAudit: 'Son Denetim',
    inLast24h: 'son 24 saatte',
    critical: 'kritik',
    securityIncidentsResolved: 'Güvenlik olayları çözüldü',
    automatedMonitoring: 'Otomatik izleme',
    never: 'Hiç',
  },

  // Security Alert Banner
  alertBanner: {
    securityAlert: 'Güvenlik Uyarısı:',
    activeBreachesDetected: '{count} aktif güvenlik ihlali tespit edildi. Acil müdahale gerekiyor.',
  },

  // Security Search Header
  searchHeader: {
    overview: 'Genel Bakış',
    securityBreaches: 'Güvenlik İhlalleri',
    auditLogs: 'Denetim Günlükleri',
    searchPlaceholder: 'Seçimleri, açıklamaları ara...',
    refresh: 'Yenile',
  },

  // Security Recent Activity
  recentActivity: {
    title: 'Son Güvenlik Aktivitesi',
    election: 'Seçim {id}',
  },

  // Security Trends Card
  trendsCard: {
    title: 'Güvenlik Trendleri',
    systemHealth: 'Sistem Sağlığı',
    dataIntegrity: 'Veri Bütünlüğü',
    monitoringStatus: 'İzleme Durumu',
    intact: 'Sağlam',
    compromised: 'Tehlikede',
    active: 'Aktif',
  },

  // Security Breaches Table
  breachesTable: {
    title: 'Güvenlik İhlalleri ({count})',
    filterByStatus: 'Duruma göre filtrele',
    allBreaches: 'Tüm İhlaller',
    activeOnly: 'Sadece Aktif',
    resolvedOnly: 'Sadece Çözülen',
    markResolved: 'Çözüldü Olarak İşaretle',
    details: 'Detaylar',
    detected: 'Tespit: {date}',
    type: 'Tür: {type}',
    resolved: 'Çözüldü: {date}',
    noBreachesFound: 'Güvenlik ihlali bulunamadı',
    systemSecure: 'Sisteminiz güvenli',
  },

  // Security Audit Logs Table
  auditLogsTable: {
    title: 'Güvenlik Denetim Günlükleri ({count})',
    election: 'Seçim',
    status: 'Durum',
    dbVotes: 'VT Oyları',
    chainVotes: 'Zincir Oyları',
    dbStatus: 'VT Durumu',
    chainStatus: 'Zincir Durumu',
    checkTime: 'Kontrol Zamanı',
    actions: 'İşlemler',
    noAuditLogsFound: 'Denetim günlüğü bulunamadı',
    securityMonitoringWillAppear: 'Güvenlik izleme burada görünecek',
    showingResults: '{showing} / {total} denetim günlüğü gösteriliyor',
  },

  // Security Badges
  badges: {
    breachDetected: 'İhlal Tespit Edildi',
    secure: 'Güvenli',
    critical: 'Kritik',
    high: 'Yüksek',
    medium: 'Orta',
    low: 'Düşük',
    resolved: 'Çözüldü',
    active: 'Aktif',
    excellent: 'Mükemmel',
    good: 'İyi',
    fair: 'Orta',
    poor: 'Zayıf',
    inactive: 'Pasif',
  },
};
