// Import stylesheets
import {
  EnvironmentController,
  TranslationRepository,
} from '@ubs-platform/translator-core';
import './style.css';

// Initial methods

const writeInHtml = (text: string) => {
  const appDiv: HTMLElement = document.getElementById('app');
  appDiv.innerHTML = text;
};

const addBtn = (text, action) => {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.addEventListener('click', action);
  document.body.appendChild(btn);
  return btn;
};

// first call initializes the environment controller
EnvironmentController.getEnvironmentController('en-us', true);
// The repository will be initialized
const repo = new TranslationRepository();
// English text
repo.registerParts(
  {
    prefix: 'home',
    stringMap: {
      hello: 'Hello, {name}. How are you today?',
      tr: 'Turkish',
      en: 'English',
      languageChange: 'You changed the application languages.',
      whatIsYourName: 'Welcome, what is your name?',
    },
  },
  'en-us'
);
// Turkish text
repo.registerParts(
  {
    prefix: 'home',
    stringMap: {
      hello: 'Merhaba, {name}. Bugün nasılsın?',
      tr: 'Türkçe',
      en: 'İngilizce',
      languageChange: 'Uygulama dilini değiştirdiniz.',
      whatIsYourName: 'Hoş geldiniz, isminiz nedir?',
    },
  },
  'tr-tr'
);

const name =
  prompt(
    // the basic text only presents a string
    repo.getString('home.whatIsYourName')
  ) || 'human';

// add buttons that changes language. the texts are hidden like you see
const enBtn = addBtn('', () =>
    EnvironmentController.getEnvironmentController().setLanguage('en-us')
  ),
  trBtn = addBtn('', () =>
    EnvironmentController.getEnvironmentController().setLanguage('tr-tr')
  );

// Text can be fetched like this, that listens the every changes so you can change by the stuation
repo.getStringListenChanges('home.tr').subscribe((a) => {
  trBtn.textContent = a;
});
repo.getStringListenChanges('home.en').subscribe((a) => {
  enBtn.textContent = a;
});

// texts can be more complicated so you can provide some variables depends your text
repo
  .getStringListenChanges({ key: 'home.hello', parameters: { name } })
  .subscribe((a) => {
    writeInHtml(a);
  });
