const router = require('express').Router();
const Game = require('../models/game');

router.get('/all', (req, res) => {
  Game.findAll({ where: { owner_id: req.user.id } })
    .then(
      (games) => res.status(200).json({ games, message: 'Data fetched.' }),

      () => res.status(500).json({ message: 'Data not found' }),
    );
});

router.get('/:id', (req, res) => {
  Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } })
    .then(
      (game) => res.status(200).json({ game }),

      (err) => res.status(500).json({ message: 'Data not found.', err: err.message }),
    );
});

router.post('/create', (req, res) => {
  Game.create({
    title: req.body.title,
    owner_id: req.user.id,
    studio: req.body.studio,
    esrb_rating: req.body.esrb_rating,
    user_rating: req.body.user_rating,
    have_played: req.body.have_played,
  })
    .then(
      (game) => res.status(200).json({ game, message: 'Game created.' }),

      (err) => res.status(500).send(err.message),
    );
});

router.put('/update/:id', (req, res) => {
  Game.update({
    title: req.body.title,
    studio: req.body.studio,
    esrb_rating: req.body.esrb_rating,
    user_rating: req.body.user_rating,
    have_played: req.body.have_played,
  },
  {
    where: {
      id: req.params.id,
      owner_id: req.user.id,
    },
  })
    .then(
      (game) => res.status(200).json({ game, message: 'Successfully updated.' }),

      (err) => res.status(500).json({ message: err.message }),

    );
});

router.delete('/remove/:id', (req, res) => {
  Game.destroy({
    where: {
      id: req.params.id,
      owner_id: req.user.id,
    },
  })
    .then(
      (game) => res.status(200).json({ game, message: 'Successfully deleted' }),

      (err) => res.status(500).json({ error: err.message }),
    );
});

module.exports = router;
