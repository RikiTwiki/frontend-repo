# Используем официальное Ubuntu изображение как базовое
FROM ubuntu:20.04

# Установка Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости, включая devDependencies
RUN npm install

# Копируем остальные файлы проекта в контейнер
COPY . .

# Открываем порт для фронтенда
EXPOSE 8081

# Команда для запуска сервера разработки
CMD ["npm", "run", "serve"]