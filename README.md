FIRST TO DO:

1.
git clone https://github.com/Cyannimazing/BCSystem BCSystem

2.
cd BCSystem

3.
code .




BACKEND SETUP

1.
cd backend

2.
composer install

3.
cp .env.example .env

4.
php artisan key:generate

5.
php artisan migrate --seed

6.
php artisan serve




ANOTHER TERMINAL
SEPERATE TO THE BACKEND

FRONTEND SETUP

1.
cd frontend

2.
npm install

3.
cp .env.example .env 

4.
npm run dev
