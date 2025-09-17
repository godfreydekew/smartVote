export const electionCreation = {
  title: 'Yeni Seçim Oluştur',
  subtitle: 'Organizasyonunuz için yeni bir seçim kurun',
  steps: {
    basicInfo: 'Temel Bilgiler',
    candidates: 'Adaylar',
    advancedSettings: 'Gelişmiş Ayarlar',
  },

  buttons: {
    next: 'İleri',
    previous: 'Geri',
    createElection: 'Seçim Oluştur',
    saveDraft: 'Taslak Kaydet',
    cancel: 'İptal',
  },

  success: {
    title: 'Seçim Oluşturuldu',
    description: "Seçiminiz başarıyla oluşturuldu ve blockchain'e yayınlandı.",
    viewElection: 'Seçimi Görüntüle',
    createAnother: 'Başka Seçim Oluştur',
  },
  errors: {
    title: 'Oluşturma Başarısız',
    description: 'Seçiminizi oluştururken bir hata oluştu. Lütfen tekrar deneyin.',
    retry: 'Tekrar Dene',
  },
  // New comprehensive translations for all components
  basicInfo: {
    title: 'Temel Bilgiler',
    subtitle: 'Seçiminizin temel detaylarını ayarlayın',
    importantInfo: {
      title: 'Önemli Bilgiler',
      description: 'Devam etmeden önce lütfen aşağıdaki gereksinimleri gözden geçirin:',
      requirements: [
        'Seçim başlığı 5-100 karakter arasında olmalıdır',
        'Açıklama en az 20 karakter uzunluğunda olmalıdır',
        'En az bir kural gereklidir',
        'Başlangıç zamanı mevcut zamandan en az 2 dakika ileri olmalıdır',
        'Bitiş zamanı başlangıç zamanından sonra olmalıdır',
      ],
    },
    fields: {
      title: {
        label: 'Seçim Başlığı*',
        placeholder: 'Seçim başlığını girin',
        description: 'Net bir başlık seçmenlerin seçimi tanımlamasına yardımcı olur.',
        validation: {
          required: 'Seçim başlığı gereklidir',
          minLength: 'Başlık en az 5 karakter olmalıdır',
          maxLength: 'Başlık 100 karakteri aşamaz',
        },
      },
      description: {
        title: 'Seçim Açıklaması',
        placeholder: 'Seçimin detaylı açıklamasını girin...',
        description: 'Seçmenlere bu seçimin amacı ve önemi hakkında bilgi sağlayın.',
        validation: {
          required: 'Açıklama gereklidir',
          minLength: 'Açıklama en az 20 karakter olmalıdır',
          maxLength: 'Açıklama 1000 karakteri aşamaz',
        },
      },
      rules: {
        title: 'Seçim Kuralları',
        placeholder: 'Kural {index}',
        description: 'Bu seçim için kuralları ve yönergeleri tanımlayın.',
        defaultRules: [
          'Her seçmen sadece bir kez oy verebilir',
          'Oylama anonimdir',
          'Sonuçlar seçim bittikten sonra yayınlanacaktır',
        ],
        validation: {
          required: 'En az bir kural gereklidir',
          empty: 'Kurallar boş olamaz',
          maxLength: 'Kurallar 200 karakteri aşamaz',
        },
      },
      organization: {
        label: 'Organizasyon*',
        placeholder: 'Bir organizasyon seçin',
        options: [
          'Kurumsal/İşletme',
          'Kar Amacı Gütmeyen',
          'Eğitim Kurumu',
          'Sendika/Dernek',
          'Topluluk Organizasyonu',
          'Devlet/Kamu Sektörü',
          'DAO/Blockchain Projesi',
          'Kooperatif',
          'Diğer',
        ],
        validation: {
          required: 'Organizasyon gereklidir',
        },
      },
      dates: {
        startDate: 'Başlangıç Tarihi ve Saati*',
        endDate: 'Bitiş Tarihi ve Saati*',
        validation: {
          startTime: 'Başlangıç zamanı en az 2 dakika ileri olmalıdır',
          endTime: 'Bitiş zamanı başlangıç zamanından sonra olmalıdır',
        },
      },
      visibility: {
        public: {
          title: 'Herkese Açık Seçim',
          description: 'Herkes katılabilir (isteğe bağlı kısıtlamalarla)',
        },
        private: {
          title: 'Özel Seçim',
          description: 'Sadece davet edilen seçmenler katılabilir (seçmen listesi gerekli)',
        },
      },
    },
    validation: {
      title: 'Doğrulama Hatası',
      description: 'Lütfen tüm gerekli alanları doğru şekilde doldurun.',
      dateError: 'Tarih Doğrulama Hatası',
    },
    buttons: {
      next: 'İleri: Adaylar',
    },
  },
  candidates: {
    title: 'Aday Ekle',
    subtitle: 'Bu seçime katılan tüm adayları ekleyin. Fotoğraflarını ve detaylarını dahil edin.',
    noCandidates: {
      title: 'Devam etmek için en az bir aday eklemeniz gerekiyor.',
      description: 'Bir seçimde en az bir aday olmalıdır.',
    },
    candidate: {
      badge: 'Aday {index}',
      photo: {
        label: 'Fotoğraf',
        upload: 'Fotoğraf Yükle',
        change: 'Fotoğrafı Değiştir',
        placeholder: 'Fotoğraf yüklenmedi',
      },
      fields: {
        name: {
          label: 'Ad',
          placeholder: 'Ad soyad',
          validation: {
            required: 'Ad gereklidir',
          },
        },
        party: {
          label: 'Parti/Bağlantı',
          placeholder: 'Parti veya bağlantıyı girin',
          validation: {
            required: 'Parti/Bağlantı gereklidir',
          },
        },
        position: {
          label: 'Pozisyon',
          placeholder: 'Pozisyon başlığını girin',
          validation: {
            required: 'Pozisyon gereklidir',
          },
        },
        bio: {
          label: 'Biyografi',
          placeholder: 'Aday biyografisini girin',
          validation: {
            required: 'Biyografi gereklidir',
            minLength: 'Biyografi en az 20 karakter olmalıdır',
          },
        },
        twitter: {
          label: 'Twitter Kullanıcı Adı',
          placeholder: '@kullaniciadi',
        },
        website: {
          label: 'Web Sitesi',
          placeholder: 'https://ornek.com',
          validation: {
            url: 'Geçerli bir URL olmalıdır',
          },
        },
      },
    },
    actions: {
      add: 'Aday Ekle',
      remove: 'Adayı Kaldır',
      removed: {
        title: 'Aday kaldırıldı',
        description: 'Aday başarıyla kaldırıldı.',
      },
      cannotRemove: {
        title: 'Kaldırılamaz',
        description: 'Bir seçimde en az bir aday olmalıdır.',
      },
    },
    validation: {
      title: 'Doğrulama Hatası',
      description: 'Lütfen her aday için tüm gerekli alanları doldurun.',
    },
    buttons: {
      previous: 'Temel Bilgilere Dön',
      next: 'İleri: Gelişmiş Ayarlar',
    },
  },
  advancedSettings: {
    title: 'Gelişmiş Ayarlar',
    subtitle: 'Seçiminizin görünümünü ve davranışını özelleştirin.',
    customizableUI: {
      title: 'Özelleştirilebilir Oylama Arayüzü',
      bannerImage: {
        label: 'Banner Resmi',
        description:
          'Seçim sayfası başlığını özelleştirmek için banner resmi yükleyin. Önerilen boyut: 1200x400 piksel.',
        upload: 'Banner Yükle',
        change: 'Bannerı Değiştir',
        placeholder: {
          title: 'Banner resmi yüklenmedi',
          description: 'Seçim sayfanızı özelleştirmek için banner resmi yükleyin',
        },
        alert:
          'Banner resmi seçim sayfanızın üst kısmında görüntülenecektir. Seçiminizi iyi temsil eden bir resim seçin.',
      },
    },
    buttons: {
      previous: 'Adaylara Dön',
      create: 'Seçim Oluştur',
    },
  },
  loading: {
    steps: [
      {
        title: 'Seçim Oluşturuluyor',
        description: 'Seçim detayları ve yapılandırması ayarlanıyor',
      },
      {
        title: "Blockchain'e Yayınlanıyor",
        description: 'Akıllı sözleşme dağıtılıyor ve seçim verileri kaydediliyor',
      },
      {
        title: 'Tamamlanıyor',
        description: 'Kurulum tamamlanıyor ve oylama için hazırlanıyor',
      },
    ],
    success: {
      title: 'Seçim Oluşturuldu!',
      description: "Seçiminiz başarıyla oluşturuldu ve blockchain'e dağıtıldı",
      contractAddress: 'Sözleşme Adresi',
      transactionHash: "İşlem Hash'i",
      viewOnExplorer: "Explorer'da Görüntüle",
      copyToClipboard: 'Panoya kopyalandı',
      actions: {
        viewElection: 'Seçimi Görüntüle',
        createAnother: 'Başka Seçim Oluştur',
      },
    },
    error: {
      title: 'Seçim Oluşturma Başarısız',
      description: 'Seçiminizi oluştururken bir hata oluştu. Lütfen tekrar deneyin.',
      retry: 'Tekrar Dene',
      return: 'Forma Dön',
    },
  },
  form: {
    stepIndicator: 'Adım {current} / {total}',
    tabs: {
      basicInfo: 'Temel Bilgiler',
      candidates: 'Adaylar',
      advancedSettings: 'Gelişmiş Ayarlar',
    },
  },
};
