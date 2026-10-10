import os
import sys
from pathlib import Path

# Конфигурация сборщика
OUTPUT_FILENAME = "bundle.txt"

# Папки, которые необходимо игнорировать
IGNORE_DIRS = {
    ".git",
    ".vscode",
    ".idea",
    "__pycache__",
    "venv",
    ".env",
    "node_modules",
}

# Файлы, которые необходимо игнорировать
IGNORE_FILES = {
    "bundle.py",
    OUTPUT_FILENAME,
    ".DS_Store",
    "Thumbs.db",
}

# Разрешенные расширения файлов для сборки
ALLOWED_EXTENSIONS = {
    ".html",
    ".css",
    ".js",
    ".json",
    ".svg",
    ".md",
    ".txt",
}

# Сопоставление расширений с синтаксисом Markdown
EXT_TO_LANG = {
    ".html": "html",
    ".css": "css",
    ".js": "javascript",
    ".json": "json",
    ".svg": "xml",
    ".md": "markdown",
    ".txt": "text",
}


def build_bundle():
    root_dir = Path(__file__).resolve().parent
    output_path = root_dir / OUTPUT_FILENAME

    print(f"[Bundle] Сканирование проекта в: {root_dir}")
    packed_files_count = 0
    total_lines = 0

    try:
        with open(output_path, "w", encoding="utf-8") as bundle_file:
            # Заголовок бандла
            bundle_file.write("# PROJECT BUNDLE\n\n")

            # Рекурсивный обход директории
            for root, dirs, files in os.walk(root_dir):
                # Исключаем системные папки
                dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

                # Сортировка для предсказуемого порядка файлов
                files.sort()

                for file in files:
                    if file in IGNORE_FILES:
                        continue

                    file_path = Path(root) / file
                    extension = file_path.suffix.lower()

                    # Проверяем расширение
                    if extension not in ALLOWED_EXTENSIONS:
                        continue

                    # Получаем чистый относительный путь (с прямыми слэшами для кроссплатформенности)
                    rel_path = file_path.relative_to(root_dir).as_posix()
                    lang = EXT_TO_LANG.get(extension, "")

                    try:
                        with open(file_path, "r", encoding="utf-8") as src_file:
                            content = src_file.read()
                            lines_count = len(content.splitlines())
                            total_lines += lines_count

                        # Форматируем блок для LLM
                        bundle_file.write(f"### {rel_path}\n")
                        bundle_file.write(f"```{lang}\n")
                        bundle_file.write(content)
                        if not content.endswith("\n"):
                            bundle_file.write("\n")
                        bundle_file.write("```\n\n")

                        print(f"  [+] Добавлен: {rel_path} ({lines_count} строк)")
                        packed_files_count += 1

                    except UnicodeDecodeError:
                        print(f"  [-] Пропущен (не UTF-8 / бинарный): {rel_path}")
                    except Exception as err:
                        print(f"  [!] Ошибка чтения файла {rel_path}: {err}")

        # Статистика сборки
        file_size_kb = output_path.stat().st_size / 1024
        print("\n" + "=" * 50)
        print(f"[Bundle] Сборка успешно завершена!")
        print(f"  -> Итоговый файл: {output_path.name}")
        print(f"  -> Упаковано файлов: {packed_files_count}")
        print(f"  -> Всего строк кода: {total_lines}")
        print(f"  -> Размер бандла: {file_size_kb:.2f} KB")
        print("=" * 50)

    except Exception as e:
        print(f"\n[Bundle] Критическая ошибка при сборке: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    build_bundle()