export const electionDetails = {
  loading: {
    title: 'Seçim Detayları Yükleniyor...',
    description: 'Seçim verilerini getirirken lütfen bekleyin.',
  },
  notFound: {
    title: 'Seçim Bulunamadı',
    description: 'Aradığınız seçim mevcut değil veya kaldırılmış.',
    returnToDashboard: "Dashboard'a Dön",
  },
  header: {
    backToDashboard: "Dashboard'a dön",
    back: 'Geri',
    status: {
      active: 'Aktif',
      upcoming: 'Yaklaşan',
      completed: 'Tamamlandı',
    },
  },
  stats: {
    startDate: 'Başlangıç Tarihi',
    endDate: 'Bitiş Tarihi',
    participants: 'Katılımcılar',
    totalVotes: 'Toplam Oylar',
    timeRemaining: 'Kalan Süre',
    endingToday: 'Bugün bitiyor',
    daysRemaining: 'gün kaldı',
    dayRemaining: 'gün kaldı',
  },
  rules: {
    title: 'Seçim Kuralları',
    noRules: 'Bu seçim için özel kurallar tanımlanmamış.',
  },
  candidates: {
    title: 'Adaylar',
    count: 'aday',
    vote: 'Oy Ver',
    viewProfile: 'Profili Görüntüle',
    votes: 'oy',
    voteCount: 'Oy Sayısı',
    percentage: 'Yüzde',
  },
  voting: {
    confirmVote: 'Oyu Onayla',
    voteFor: 'İçin oy ver',
    confirmVoteDescription: 'Bu aday için oy vermek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
    voteSuccessful: 'Oy Başarılı',
    voteSuccessfulDescription: 'Başarıyla oy verdiniz',
    alreadyVoted: 'Bu seçimde zaten oy verdiniz.',
    votingError: 'Oy Verme Hatası',
    votingErrorDescription: 'Oyunuzu işlerken bir hata oluştu. Lütfen tekrar deneyin.',
    securityAlert: 'Uyarı',
    securityAlertDescription:
      'Bu seçimde zaten oy verdiniz. Bir hata olduğunu düşünüyorsanız lütfen destek ile iletişime geçin.',
  },
  blockchain: {
    title: 'Blockchain Logları',
    subtitle: 'Bu seçim için blockchain işlem loglarını görüntüleyin',
    contractAddress: 'Kontrat Adresi',
    network: 'Ağ',
    transactionHash: "İşlem Hash'i",
    blockNumber: 'Blok Numarası',
    gasUsed: 'Kullanılan Gas',
    status: 'Durum',
  },
  mobile: {
    viewCandidatesAndVote: 'Adayları görüntüle ve oy ver',
  },
};
