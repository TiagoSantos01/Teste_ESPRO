import { I18nLoader, I18nTranslation } from 'nestjs-i18n';
import * as fs from 'fs';
import * as path from 'path';
import { FlatJsonLoaderOptions } from '@domain/dto/flat-json-loader-options.dto';



export class FlatJsonI18nLoader extends I18nLoader {
  private loadedLanguages: string[] = [];

  constructor(private options?: FlatJsonLoaderOptions) {
    super();
    this.options = this.options || {};
  }
  languages(): Promise<string[]> {
    return Promise.resolve(this.loadedLanguages);
  }

  load(): Promise<I18nTranslation> {
    const translations: I18nTranslation = {};
    const devPath = path.join(process.cwd(), 'src', 'i18n');
    const distPath = path.join(process.cwd(), 'dist', 'src', 'i18n');
    const prodPath = path.join(__dirname, '..', '..', 'i18n');

    let translationPath: string = devPath;
    if (fs.existsSync(distPath)) translationPath = distPath;
    if (fs.existsSync(prodPath)) translationPath = prodPath;

    if (!fs.existsSync(translationPath)) {
      return Promise.resolve(translations);
    }
    console.log(translationPath);
    this.loadedLanguages = [];

    try {
      const files = fs.readdirSync(translationPath);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const language = path.basename(file, '.json');
          const filePath = path.join(translationPath, file);

          try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            translations[language] = JSON.parse(fileContent) as I18nTranslation;

            if (!this.loadedLanguages.includes(language)) {
              this.loadedLanguages.push(language);
            }

          } catch (_error) {
            console.error(
              `Error loading translation file ${filePath}:`,
              _error,
            );
          }
        }
      }
    } catch (_error) {
      console.error(
        `Error reading translation directory ${translationPath}:`,
        _error,
      );
    }

    return Promise.resolve(translations);
  }
}
