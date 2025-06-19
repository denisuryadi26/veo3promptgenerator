// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENT SELECTORS ---
  const coinCountEl = document.getElementById('coinCount');
  const addCoinBtn = document.getElementById('addCoinBtn');
  const noCoinsNotification = document.getElementById('noCoinsNotification');
  const generateBtn = document.getElementById('generateBtn');
  const promptIndonesia = document.getElementById('promptIndonesia');
  const promptEnglish = document.getElementById('promptEnglish');
  const copyBtnId = document.getElementById('copyBtnId');
  const copyBtnEn = document.getElementById('copyBtnEn');
  const openGeminiIdBtn = document.getElementById('openGeminiIdBtn');
  const openGeminiEnBtn = document.getElementById('openGeminiEnBtn');
  const fixPromptIdBtn = document.getElementById('fixPromptIdBtn');
  const fixPromptEnBtn = document.getElementById('fixPromptEnBtn');
  const guideBtn = document.getElementById('guideBtn');
  const guideModal = document.getElementById('guideModal');
  const closeGuideBtn = document.getElementById('closeGuideBtn');
  const imageUploadInput = document.getElementById('imageUploadInput');
  const imagePreview = document.getElementById('imagePreview');
  const describeSubjectBtn = document.getElementById('describeSubjectBtn');
  const describePlaceBtn = document.getElementById('describePlaceBtn');
  const imageUploadIcon = document.getElementById('imageUploadIcon');
  const imageUploadContainer = document.getElementById('imageUploadContainer');

  // -- SIMPAN KARAKTER --
  const saveCharacterBtn = document.getElementById('saveCharacterBtn');
  const loadCharacterBtn = document.getElementById('loadCharacterBtn'); // New Modal Elements

  const saveCharacterModal = document.getElementById('saveCharacterModal');
  const closeSaveModalBtn = document.getElementById('closeSaveModalBtn');
  const characterNameInput = document.getElementById('characterNameInput');
  const confirmSaveCharacterBtn = document.getElementById(
    'confirmSaveCharacterBtn',
  );

  const loadCharacterModal = document.getElementById('loadCharacterModal');
  const closeLoadModalBtn = document.getElementById('closeLoadModalBtn');
  const characterList = document.getElementById('characterList');
  const noCharactersMessage = document.getElementById('noCharactersMessage');
  const clearAllCharactersBtn = document.getElementById(
    'clearAllCharactersBtn',
  );

  // -- SIMPAN TEMPAT --
  const savePlaceBtn = document.getElementById('savePlaceBtn');
  const loadPlaceBtn = document.getElementById('loadPlaceBtn'); // New Modal Elements

  const savePlaceModal = document.getElementById('savePlaceModal');
  const closeSaveModalPlaceBtn = document.getElementById(
    'closeSaveModalPlaceBtn',
  );
  const placeNameInput = document.getElementById('placeNameInput');
  const confirmSavePlaceBtn = document.getElementById('confirmSavePlaceBtn');

  const loadPlaceModal = document.getElementById('loadPlaceModal');
  const closeLoadModalPlaceBtn = document.getElementById(
    'closeLoadModalPlaceBtn',
  );
  const placeList = document.getElementById('placeList');
  const noPlacesMessage = document.getElementById('noPlacesMessage');
  const clearAllPlacesBtn = document.getElementById('clearAllPlacesBtn');

  const inputs = {
    subjek: document.getElementById('subjek'),
    aksi: document.getElementById('aksi'),
    ekspresi: document.getElementById('ekspresi'),
    tempat: document.getElementById('tempat'),
    waktu: document.getElementById('waktu'),
    sudutKamera: document.getElementById('sudutKamera'),
    kamera: document.getElementById('kamera'),
    pencahayaan: document.getElementById('pencahayaan'),
    style: document.getElementById('style'),
    suasana: document.getElementById('suasana'),
    backsound: document.getElementById('backsound'),
    kalimat: document.getElementById('kalimat'),
    detail: document.getElementById('detail'),
    negative: document.getElementById('negative'),
  };

  // --- STATE MANAGEMENT ---
  let coins = 0;
  let isWaitingForAdReward = false;
  let uploadedImageData = null;
  let adOpenedTime = null; // NEW: To store the timestamp when the ad tab is opened

  // --- COIN SYSTEM ---
  function saveCoins() {
    localStorage.setItem('userVeoCoins', coins);
  }

  function updateButtonState() {
    if (generateBtn.disabled) return;
    generateBtn.textContent = coins < 1 ? 'Koin Habis' : 'Generate Prompt';
  }

  function updateCoinDisplay() {
    coinCountEl.textContent = coins;
    updateButtonState();
  }

  function loadCoins() {
    const savedCoins = localStorage.getItem('userVeoCoins');
    coins = savedCoins === null ? 5 : parseInt(savedCoins, 10);
    saveCoins();
    updateCoinDisplay();
  }

  function handleAddCoinClick() {
    if (isWaitingForAdReward) return;

    isWaitingForAdReward = true;
    adOpenedTime = Date.now(); // MODIFIED: Record the current time
    noCoinsNotification.classList.add('hidden');

    addCoinBtn.disabled = true;
    // MODIFIED: Updated title to inform the user about the timer
    addCoinBtn.title =
      'Tunggu 5 detik di tab baru, lalu kembali untuk mendapatkan koin';
    addCoinBtn.textContent = '...';

    window.open(
      'https://www.tiktok.com/@denisuryadi26/video/7510544818146168072',
      '_blank',
    );
  }

  function handleWindowFocus() {
    // MODIFIED: Added timer logic
    if (isWaitingForAdReward && adOpenedTime) {
      const timeElapsed = Date.now() - adOpenedTime;
      const requiredTime = 2000; // 2 seconds in milliseconds

      // Reset state immediately to prevent multiple triggers
      isWaitingForAdReward = false;
      adOpenedTime = null;

      // Re-enable the button immediately
      addCoinBtn.disabled = false;
      addCoinBtn.title = 'Tambah 5 Koin';
      addCoinBtn.textContent = '+ Tambah Koin';

      if (timeElapsed >= requiredTime) {
        // Grant coins only if enough time has passed
        coins += 5;
        console.log('Coins added!');
        saveCoins();
        updateCoinDisplay();

        // Visual feedback for success
        const coinContainer = coinCountEl.parentElement;
        coinContainer.classList.add(
          'bg-green-600',
          'transition-colors',
          'duration-300',
        );
        setTimeout(() => {
          coinContainer.classList.remove('bg-green-600');
        }, 1500);
      } else {
        // Silently fail if the user comes back too early.
        // A custom notification could be added here for better UX.
        console.log('Returned too quickly, no coins awarded.');
      }
    }
  }

  // --- Saved Characters Management ---
  const LOCAL_STORAGE_SAVED_CHARACTERS_KEY = 'veoPromptSavedCharacters';
  let savedCharacters = []; // Will hold an array of { name: string, value: string }

  function loadSavedCharacters() {
    const data = localStorage.getItem(LOCAL_STORAGE_SAVED_CHARACTERS_KEY);
    try {
      savedCharacters = data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse saved characters from localStorage:', e);
      savedCharacters = []; // Reset on error
    }
  }

  function saveCharactersToLocalStorage() {
    localStorage.setItem(
      LOCAL_STORAGE_SAVED_CHARACTERS_KEY,
      JSON.stringify(savedCharacters),
    );
  }

  // --- Save Character Modal Functions ---
  function openSaveCharacterModal() {
    if (!inputs.subjek.value.trim()) {
      alert('Kolom Subjek kosong. Isi dulu sebelum menyimpan karakter.');
      return;
    }
    characterNameInput.value = ''; // Clear previous input
    saveCharacterModal.classList.remove('hidden');
    characterNameInput.focus(); // Focus on the input field
  }

  function closeSaveCharacterModal() {
    saveCharacterModal.classList.add('hidden');
  }

  function handleSaveCharacter() {
    const characterName = characterNameInput.value.trim();
    const characterValue = inputs.subjek.value.trim();

    if (!characterName) {
      alert('Nama karakter tidak boleh kosong!');
      return;
    }

    if (!characterValue) {
      alert('Kolom subjek kosong, tidak ada yang disimpan.');
      return;
    } // Check if character name already exists

    const existingIndex = savedCharacters.findIndex(
      (char) => char.name.toLowerCase() === characterName.toLowerCase(),
    );
    if (existingIndex > -1) {
      if (
        !confirm(`Karakter dengan nama "${characterName}" sudah ada. Timpa?`)
      ) {
        return;
      }
      savedCharacters[existingIndex].value = characterValue; // Overwrite
    } else {
      savedCharacters.push({ name: characterName, value: characterValue });
    }

    saveCharactersToLocalStorage();
    showCopyFeedback(confirmSaveCharacterBtn, 'Tersimpan!'); // Feedback on save button
    setTimeout(closeSaveCharacterModal, 1000); // Close after a short delay
  }

  // --- Load Character Modal Functions ---
  function openLoadCharacterModal() {
    renderCharacterList();
    loadCharacterModal.classList.remove('hidden');
  }

  function closeLoadCharacterModal() {
    loadCharacterModal.classList.add('hidden');
  }

  function renderCharacterList() {
    characterList.innerHTML = ''; // Clear existing list
    if (savedCharacters.length === 0) {
      noCharactersMessage.classList.remove('hidden');
      clearAllCharactersBtn.classList.add('hidden');
    } else {
      noCharactersMessage.classList.add('hidden');
      clearAllCharactersBtn.classList.remove('hidden');
      savedCharacters.forEach((char, index) => {
        const listItem = document.createElement('li');
        listItem.className =
          'flex items-center justify-between bg-gray-700/70 p-3 rounded-lg border border-gray-600';
        listItem.innerHTML = `
          <span class="font-medium text-white flex-1 truncate">${char.name}</span>
          <div class="flex space-x-2 pl-2">
            <button data-index="${index}" class="load-char-btn bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">Muat</button>
            <button data-index="${index}" class="delete-char-btn bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">Hapus</button>
          </div>
        `;
        characterList.appendChild(listItem);
      }); // Add event listeners to dynamically created buttons

      characterList.querySelectorAll('.load-char-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          inputs.subjek.value = savedCharacters[index].value;
          closeLoadCharacterModal();
          showCopyFeedback(
            loadCharacterBtn,
            `"${savedCharacters[index].name}" dimuat!`,
          ); // Feedback for main load button
        });
      });

      characterList.querySelectorAll('.delete-char-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          if (
            confirm(
              `Apakah Anda yakin ingin menghapus karakter "${savedCharacters[index].name}"?`,
            )
          ) {
            savedCharacters.splice(index, 1); // Remove from array
            saveCharactersToLocalStorage();
            renderCharacterList(); // Re-render the list
            alert('Karakter dihapus!');
          }
        });
      });
    }
  }

  function clearAllSavedCharacters() {
    if (
      confirm('Apakah Anda yakin ingin menghapus SEMUA karakter yang disimpan?')
    ) {
      savedCharacters = [];
      saveCharactersToLocalStorage();
      renderCharacterList(); // Re-render the list (will show "No characters" message)
      alert('Semua karakter dihapus!');
    }
  }

  // --- Saved Place Management ---
  const LOCAL_STORAGE_SAVED_PLACES_KEY = 'veoPromptSavedPlaces';
  let savedPlaces = []; // Will hold an array of { name: string, value: string }

  function loadSavedPlaces() {
    const data = localStorage.getItem(LOCAL_STORAGE_SAVED_PLACES_KEY);
    try {
      savedPlaces = data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse saved places from localStorage:', e);
      savedPlaces = []; // Reset on error
    }
  }

  function savePlacesToLocalStorage() {
    localStorage.setItem(
      LOCAL_STORAGE_SAVED_PLACES_KEY,
      JSON.stringify(savedPlaces),
    );
  }

  // --- Save Place Modal Functions ---
  function openSavePlaceModal() {
    if (!inputs.tempat.value.trim()) {
      alert('Kolom Tempat kosong. Isi dulu sebelum menyimpan tempat.');
      return;
    }
    placeNameInput.value = ''; // Clear previous input
    savePlaceModal.classList.remove('hidden');
    placeNameInput.focus(); // Focus on the input field
  }

  function closeSavePlaceModal() {
    savePlaceModal.classList.add('hidden');
  }

  function handleSavePlace() {
    const placeName = placeNameInput.value.trim();
    const placeValue = inputs.tempat.value.trim();

    if (!placeName) {
      alert('Nama tempat tidak boleh kosong!');
      return;
    }

    if (!placeValue) {
      alert('Kolom tempat kosong, tidak ada yang disimpan.');
      return;
    } // Check if place name already exists

    const existingIndex = savedPlaces.findIndex(
      (char) => char.name.toLowerCase() === placeName.toLowerCase(),
    );
    if (existingIndex > -1) {
      if (!confirm(`Tempat dengan nama "${placeName}" sudah ada. Timpa?`)) {
        return;
      }
      savedPlaces[existingIndex].value = placeValue; // Overwrite
    } else {
      savedPlaces.push({ name: placeName, value: placeValue });
    }

    savePlacesToLocalStorage();
    showCopyFeedback(confirmSavePlaceBtn, 'Tersimpan!'); // Feedback on save button
    setTimeout(closeSavePlaceModal, 1000); // Close after a short delay
  }

  // --- Load Place Modal Functions ---
  function openLoadPlaceModal() {
    renderPlaceList();
    loadPlaceModal.classList.remove('hidden');
  }

  function closeLoadPlaceModal() {
    loadPlaceModal.classList.add('hidden');
  }

  function renderPlaceList() {
    placeList.innerHTML = ''; // Clear existing list
    if (savedPlaces.length === 0) {
      noPlacesMessage.classList.remove('hidden');
      clearAllPlacesBtn.classList.add('hidden');
    } else {
      noPlacesMessage.classList.add('hidden');
      clearAllPlacesBtn.classList.remove('hidden');
      savedPlaces.forEach((place, index) => {
        const listItem = document.createElement('li');
        listItem.className =
          'flex items-center justify-between bg-gray-700/70 p-3 rounded-lg border border-gray-600';
        listItem.innerHTML = `
          <span class="font-medium text-white flex-1 truncate">${place.name}</span>
          <div class="flex space-x-2 pl-2">
            <button data-index="${index}" class="load-place-btn bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">Muat</button>
            <button data-index="${index}" class="delete-place-btn bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors">Hapus</button>
          </div>
        `;
        placeList.appendChild(listItem);
      }); // Add event listeners to dynamically created buttons

      placeList.querySelectorAll('.load-place-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          inputs.tempat.value = savedPlaces[index].value;
          closeLoadPlaceModal();
          showCopyFeedback(
            loadPlaceBtn,
            `"${savedPlaces[index].name}" dimuat!`,
          ); // Feedback for main load button
        });
      });

      placeList.querySelectorAll('.delete-place-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = parseInt(e.target.dataset.index);
          if (
            confirm(
              `Apakah Anda yakin ingin menghapus tempat "${savedPlaces[index].name}"?`,
            )
          ) {
            savedPlaces.splice(index, 1); // Remove from array
            savePlacesToLocalStorage();
            renderPlaceList(); // Re-render the list
            alert('Tempat dihapus!');
          }
        });
      });
    }
  }

  function clearAllSavedPlaces() {
    if (
      confirm('Apakah Anda yakin ingin menghapus SEMUA tempat yang disimpan?')
    ) {
      savedPlaces = [];
      savePlacesToLocalStorage();
      renderPlaceList(); // Re-render the list (will show "No places" message)
      alert('Semua tempat dihapus!');
    }
  }

  // --- PROMPT GENERATOR SYSTEM ---
  function showCopyFeedback(button, text = 'Berhasil Disalin!') {
    const originalText = button.textContent;
    button.textContent = text;
    const originalColorClasses = Array.from(button.classList).filter(
      (c) => c.startsWith('bg-') || c.startsWith('hover:bg-'),
    );
    button.classList.remove(...originalColorClasses);
    button.classList.add('bg-green-600', 'hover:bg-green-700');

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-600', 'hover:bg-green-700');
      button.classList.add(...originalColorClasses);
    }, 2000);
  }

  function fallbackCopyText(
    textarea,
    button,
    feedbackText = 'Berhasil Disalin!',
  ) {
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    try {
      document.execCommand('copy');
      showCopyFeedback(button, feedbackText);
    } catch (err) {
      console.error('Fallback: Gagal menyalin', err);
    }
  }

  function copyText(textarea, button) {
    const promptText = textarea.value.trim();
    if (!promptText) return;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(promptText)
        .then(() => {
          showCopyFeedback(button);
        })
        .catch((err) => {
          console.warn(
            'Gagal menyalin dengan API modern, mencoba metode fallback.',
            err,
          );
          fallbackCopyText(textarea, button);
        });
    } else {
      fallbackCopyText(textarea, button);
    }
  }

  function openInGemini(textarea, button) {
    const promptText = textarea.value.trim();
    const geminiUrl = `https://gemini.google.com/app`;

    if (promptText) {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(promptText)
          .then(() => {
            showCopyFeedback(button, 'Disalin!');
            window.open(geminiUrl, '_blank');
          })
          .catch(() => {
            fallbackCopyText(textarea, button, 'Disalin!');
            window.open(geminiUrl, '_blank');
          });
      } else {
        fallbackCopyText(textarea, button, 'Disalin!');
        window.open(geminiUrl, '_blank');
      }
    } else {
      window.open(geminiUrl, '_blank');
    }
  }

  function generateIndonesianPrompt() {
    let combinedActionExpression = inputs.aksi.value.trim();
    const expression = inputs.ekspresi.value.trim();
    if (combinedActionExpression && expression) {
      combinedActionExpression += ` dengan ekspresi ${expression}`;
    } else if (expression) {
      combinedActionExpression = expression;
    }

    const place = inputs.tempat.value.trim();
    const time = inputs.waktu.value.trim();
    let locationAndTime = '';
    if (place && time) {
      locationAndTime = `${place} saat ${time}`;
    } else {
      locationAndTime = place || time;
    }

    const promptParts = [
      inputs.style.value,
      inputs.sudutKamera.value,
      inputs.kamera.value,
      inputs.subjek.value,
      combinedActionExpression,
      locationAndTime,
      inputs.pencahayaan.value.trim()
        ? `dengan pencahayaan ${inputs.pencahayaan.value.trim()}`
        : '',
      inputs.suasana.value.trim()
        ? `suasana ${inputs.suasana.value.trim()}`
        : '',
      inputs.backsound.value.trim()
        ? `suara ${inputs.backsound.value.trim()} dalam Bahasa Indonesia`
        : '',
      inputs.kalimat.value.trim()
        ? `kalimat diucapkan dalam Bahasa Indonesia: "${inputs.kalimat.value.trim()}"`
        : '',
      inputs.detail.value,
      inputs.negative.value ? `Hindari : ${inputs.negative.value}` : '',
    ];

    return promptParts.filter((part) => part && part.trim()).join(', ');
  }

  // --- GEMINI API INTEGRATION ---
  async function callGeminiAPI(instruction, imageData = null) {
    // WARNING: Your API key is exposed here. Move this to a backend server for security.
    const apiKey = 'AIzaSyDO65JAzRl0aEry-7ftU85nzaqt0EtMw7c';
    const model = 'gemini-1.5-flash-latest'; // Using a consistent, recent model

    const parts = [{ text: instruction }];
    if (imageData) {
      parts.push({
        inline_data: {
          mime_type: imageData.type,
          data: imageData.data,
        },
      });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: parts }],
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();

    // Safely access the response text
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return text;
    } else {
      console.log('No valid response text found, full response:', result);
      throw new Error('Invalid or empty response structure from API.');
    }
  }

  async function createAndTranslatePrompt() {
    if (coins < 1) {
      noCoinsNotification.classList.remove('hidden');
      setTimeout(() => noCoinsNotification.classList.add('hidden'), 3000);
      return;
    }

    noCoinsNotification.classList.add('hidden');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Membuat Prompt...';

    const indonesianPrompt = generateIndonesianPrompt();
    promptIndonesia.value = indonesianPrompt;
    promptEnglish.value = 'Menerjemahkan...';

    if (!indonesianPrompt) {
      generateBtn.disabled = false;
      updateButtonState();
      promptEnglish.value = '';
      return;
    }

    coins--;
    saveCoins();
    updateCoinDisplay();

    try {
      const instruction = `Translate the following creative video prompt from Indonesian to English. Keep the structure and comma separation. Be concise and direct. Respond only with the translated prompt, without any introductory text. Text to translate: "${indonesianPrompt}"`;
      const translatedText = await callGeminiAPI(instruction);
      promptEnglish.value = translatedText.trim();
    } catch (error) {
      console.error('Translation Error:', error);
      promptEnglish.value =
        'Gagal menerjemahkan. Periksa API Key atau koneksi.';
    } finally {
      generateBtn.disabled = false;
      updateButtonState();
    }
  }

  // --- UTILITY FUNCTIONS & EVENT HANDLERS ---

  // Universal function to handle API calls with button state changes
  async function handleApiInteraction(button, apiFunction) {
    if (coins < 1) {
      noCoinsNotification.classList.remove('hidden');
      setTimeout(() => noCoinsNotification.classList.add('hidden'), 3000);
      return;
    }

    const originalButtonText = button.textContent;
    const allButtons = [
      generateBtn,
      fixPromptIdBtn,
      fixPromptEnBtn,
      describeSubjectBtn,
      describePlaceBtn,
    ];
    allButtons.forEach((btn) => (btn.disabled = true));
    button.textContent = 'Memproses...';

    coins--;
    saveCoins();
    updateCoinDisplay();

    try {
      await apiFunction();
    } catch (error) {
      console.error('API Interaction Error:', error);
      // You can add user-facing error messages here, e.g., in a notification area
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      allButtons.forEach((btn) => (btn.disabled = false));
      // Re-enable describe buttons only if an image is present
      describeSubjectBtn.disabled = !uploadedImageData;
      describePlaceBtn.disabled = !uploadedImageData;
      button.textContent = originalButtonText;
      updateButtonState();
    }
  }

  function fixAndSyncPrompt(
    sourceTextarea,
    targetTextarea,
    button,
    sourceLang,
  ) {
    const apiFunction = async () => {
      const originalPrompt = sourceTextarea.value;
      if (!originalPrompt) return;

      button.textContent = 'Memperbaiki...';
      const targetLang = sourceLang === 'id' ? 'English' : 'Bahasa Indonesia';
      const fixInstruction = `Analyze and fix this prompt for a video AI generator. Make it more effective and compliant. Focus on natural language, remove contradictions, and ensure it's a high-quality, descriptive prompt. The prompt is: "${originalPrompt}". Respond only with the improved prompt in ${
        sourceLang === 'id' ? 'Indonesian' : 'English'
      }, without any introductory text.`;
      const fixedPrompt = await callGeminiAPI(fixInstruction);
      sourceTextarea.value = fixedPrompt.trim();

      button.textContent = 'Menerjemahkan...';
      const translateInstruction = `Translate the following creative video prompt to ${targetLang}. Be concise and direct. Respond only with the translated prompt. Text to translate: "${fixedPrompt}"`;
      const translatedText = await callGeminiAPI(translateInstruction);
      targetTextarea.value = translatedText.trim();
    };

    handleApiInteraction(button, apiFunction);
  }

  function describeImage(type) {
    const apiFunction = async () => {
      if (!uploadedImageData) {
        alert('Silakan unggah gambar terlebih dahulu.');
        return;
      }

      const button = type === 'subject' ? describeSubjectBtn : describePlaceBtn;
      button.textContent = 'Menganalisis...';

      const instruction =
        type === 'subject'
          ? 'Analisis secara spesifik hanya orang/subjek utama dalam gambar ini. Abaikan sepenuhnya latar belakang atau tempat. Berikan deskripsi mendetail dalam Bahasa Indonesia yang mencakup detail wajah, warna dan gaya rambut, pakaian dan aksesoris, warna kulit, dan perkiraan usia. Gabungkan semuanya menjadi satu frasa deskriptif yang kohesif. Balas HANYA dengan frasa deskriptif ini, tanpa teks atau format lain.'
          : 'Anda adalah seorang prompt engineer. Analisis gambar ini dan buatlah deskripsi prompt yang sinematik untuk latar belakangnya dalam Bahasa Indonesia. Fokus pada suasana, elemen visual kunci, dan mood. Abaikan orang atau subjek utama. Balas HANYA dengan deskripsi prompt ini, tanpa teks pembuka.';

      const description = await callGeminiAPI(instruction, uploadedImageData);
      const targetInput = type === 'subject' ? inputs.subjek : inputs.tempat;
      targetInput.value = description.trim();
    };

    const buttonToUpdate =
      type === 'subject' ? describeSubjectBtn : describePlaceBtn;
    handleApiInteraction(buttonToUpdate, apiFunction);
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove('hidden');
      imageUploadIcon.classList.add('hidden');
      uploadedImageData = {
        type: file.type,
        data: e.target.result.split(',')[1], // Get base64 part
      };
      describeSubjectBtn.disabled = false;
      describePlaceBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  // --- EVENT LISTENERS INITIALIZATION ---
  loadCoins();
  loadSavedCharacters(); // NEW: Load characters when the page loads
  loadSavedPlaces(); // NEW: Load places when the page loads

  addCoinBtn.addEventListener('click', handleAddCoinClick);
  window.addEventListener('focus', handleWindowFocus);

  generateBtn.addEventListener('click', createAndTranslatePrompt);
  copyBtnId.addEventListener('click', () =>
    copyText(promptIndonesia, copyBtnId),
  );
  copyBtnEn.addEventListener('click', () => copyText(promptEnglish, copyBtnEn));
  openGeminiIdBtn.addEventListener('click', () =>
    openInGemini(promptIndonesia, openGeminiIdBtn),
  );
  openGeminiEnBtn.addEventListener('click', () =>
    openInGemini(promptEnglish, openGeminiEnBtn),
  );
  fixPromptIdBtn.addEventListener('click', () =>
    fixAndSyncPrompt(promptIndonesia, promptEnglish, fixPromptIdBtn, 'id'),
  );
  fixPromptEnBtn.addEventListener('click', () =>
    fixAndSyncPrompt(promptEnglish, promptIndonesia, fixPromptEnBtn, 'en'),
  );

  imageUploadInput.addEventListener('change', handleImageUpload);
  describeSubjectBtn.addEventListener('click', () => describeImage('subject'));
  describePlaceBtn.addEventListener('click', () => describeImage('place'));

  guideBtn.addEventListener('click', () =>
    guideModal.classList.remove('hidden'),
  );
  closeGuideBtn.addEventListener('click', () =>
    guideModal.classList.add('hidden'),
  );
  guideModal.addEventListener('click', (e) => {
    if (e.target === guideModal) {
      guideModal.classList.add('hidden');
    }
  });

  // NEW: Event Listeners for Character Save/Load/Delete

  saveCharacterBtn.addEventListener('click', openSaveCharacterModal);
  closeSaveModalBtn.addEventListener('click', closeSaveCharacterModal);
  confirmSaveCharacterBtn.addEventListener('click', handleSaveCharacter);
  saveCharacterModal.addEventListener('click', (e) => {
    if (e.target === saveCharacterModal) {
      closeSaveCharacterModal();
    }
  });

  loadCharacterBtn.addEventListener('click', openLoadCharacterModal);
  closeLoadModalBtn.addEventListener('click', closeLoadCharacterModal);
  loadCharacterModal.addEventListener('click', (e) => {
    if (e.target === loadCharacterModal) {
      closeLoadCharacterModal();
    }
  });

  clearAllCharactersBtn.addEventListener('click', clearAllSavedCharacters); // Drag and Drop for Image Upload

  // NEW: Event Listeners for Place Save/Load/Delete
  savePlaceBtn.addEventListener('click', openSavePlaceModal);
  closeSaveModalPlaceBtn.addEventListener('click', closeSavePlaceModal);
  confirmSavePlaceBtn.addEventListener('click', handleSavePlace);
  savePlaceModal.addEventListener('click', (e) => {
    if (e.target === savePlaceModal) {
      closeSavePlaceModal();
    }
  });

  loadPlaceBtn.addEventListener('click', openLoadPlaceModal);
  closeLoadModalPlaceBtn.addEventListener('click', closeLoadPlaceModal);
  loadPlaceModal.addEventListener('click', (e) => {
    if (e.target === loadPlaceModal) {
      closeLoadPlaceModal();
    }
  });

  clearAllPlacesBtn.addEventListener('click', clearAllSavedPlaces); // Drag and Drop for Image Upload

  imageUploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadContainer.parentElement.classList.add('border-indigo-500');
  });
  imageUploadContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    imageUploadContainer.parentElement.classList.remove('border-indigo-500');
  });
  imageUploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadContainer.parentElement.classList.remove('border-indigo-500');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      imageUploadInput.files = files;
      handleImageUpload({ target: imageUploadInput });
    }
  });
});
