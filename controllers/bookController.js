const { Op } = require('sequelize');
const { Book, Author, Category } = require('../models');

module.exports = {
  // ✅ Получить все книги (GET /books)
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: books } = await Book.findAndCountAll({
        attributes: ['id', 'title', 'description', 'publication_year', 'image_url', 'createdAt', 'updatedAt'],
        include: [
          {
            model: Author,
            as: 'authors',
            attributes: ['id', 'first_name', 'last_name'],
            through: { attributes: [] }
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ],
        limit,
        offset,
        order: [['title', 'ASC']]
      });

      // Преобразуем image_url в image для фронтенда
      const booksWithImage = books.map(book => {
        const bookData = book.toJSON();
        return {
          ...bookData,
          image: bookData.image_url || null
        };
      });

      res.json({
        books: booksWithImage,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении книг' });
    }
  },

  // ✅ Получить книгу по ID (GET /books/:id)
  async getById(req, res) {
    try {
      const book = await Book.findByPk(req.params.id, {
        attributes: ['id', 'title', 'description', 'publication_year', 'image_url', 'createdAt', 'updatedAt'],
        include: [
          {
            model: Author,
            as: 'authors',
            attributes: ['id', 'first_name', 'last_name'],
            through: { attributes: [] }
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      });

      if (!book) {
        return res.status(404).json({ error: 'Книга не найдена' });
      }

      // Преобразуем image_url в image для фронтенда
      const bookData = book.toJSON();
      bookData.image = bookData.image_url || null;

      res.json(bookData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при получении книги' });
    }
  },

  // ✅ Создать книгу (POST /books)
  async create(req, res) {
    try {
      const { title, description, publication_year, category_id, author_ids, image } = req.body;
      
      console.log('Создание книги. Полученные данные:', {
        title,
        description,
        publication_year,
        category_id,
        author_ids,
        image
      });

      // 1. Создаём книгу
      const book = await Book.create({
        title,
        description,
        publication_year,
        category_id,
        image_url: image, // Сохраняем путь к изображению
        last_update: new Date()
      });

      console.log('Книга создана:', book.toJSON());

      // 2. Устанавливаем авторов (если переданы)
      if (author_ids && Array.isArray(author_ids)) {
        await book.setAuthors(author_ids);
      }

      // 3. Получаем книгу с включениями
      const fullBook = await Book.findByPk(book.id, {
        attributes: ['id', 'title', 'description', 'publication_year', 'image_url', 'createdAt', 'updatedAt'],
        include: [
          {
            model: Author,
            as: 'authors',
            attributes: ['id', 'first_name', 'last_name'],
            through: { attributes: [] }
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name']
          }
        ]
      });

      // Преобразуем image_url в image для фронтенда
      const bookData = fullBook.toJSON();
      bookData.image = bookData.image_url || null;

      console.log('Отправляем ответ:', bookData);

      res.status(201).json(bookData);
    } catch (err) {
      console.error('Ошибка при создании книги:', err);
      res.status(400).json({ error: 'Ошибка при создании книги' });
    }
  },

  // ✅ Обновить книгу (PUT /books/:id)
  async update(req, res) {
    try {
      const { author_ids, ...bookData } = req.body;

      // 1. Обновляем книгу
      const [updated] = await Book.update(bookData, {
        where: { id: req.params.id }
      });

      if (!updated) {
        return res.status(404).json({ error: 'Книга не найдена' });
      }

      // 2. Обновляем авторов (если переданы)
      if (author_ids && Array.isArray(author_ids)) {
        const book = await Book.findByPk(req.params.id);
        await book.setAuthors(author_ids);
      }

      res.json({ message: 'Книга обновлена' });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Ошибка при обновлении книги' });
    }
  },

  // ✅ Удалить книгу (DELETE /books/:id)
  async delete(req, res) {
    try {
      const deleted = await Book.destroy({
        where: { id: req.params.id }
      });

      if (!deleted) {
        return res.status(404).json({ error: 'Книга не найдена' });
      }

      res.json({ message: 'Книга удалена' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ошибка при удалении книги' });
    }
  },

  // ✅ Поиск книг (GET /books/search?title=&author=&category=)
  async search(req, res) {
    try {
      const { title, author, category } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows: books } = await Book.findAndCountAll({
        include: [
          {
            model: Author,
            as: 'authors',
            attributes: ['id', 'first_name', 'last_name'],
            where: author
              ? {
                  [Op.or]: [
                    { first_name: { [Op.iLike]: `%${author}%` } },
                    { last_name: { [Op.iLike]: `%${author}%` } }
                  ]
                }
              : undefined,
            through: { attributes: [] },
            required: !!author
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
            where: category
              ? {
                  name: {
                    [Op.iLike]: `%${category}%`
                  }
                }
              : undefined,
            required: !!category
          }
        ],
        where: title
          ? {
              title: {
                [Op.iLike]: `%${title}%`
              }
            }
          : undefined,
        limit,
        offset,
        order: [['title', 'ASC']]
      });

      // Добавляем поле image для каждой книги
      const booksWithImage = books.map(book => {
        const b = book.toJSON ? book.toJSON() : book;
        return {
          ...b,
          image: b.image_url || null
        };
      });

      res.json({
        books: booksWithImage,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при поиске книг' });
    }
  }
};
