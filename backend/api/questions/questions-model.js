const db = require('../../data/db-config')

async function getAll() {
  const questions = await db('questions')
  let options = await db('options')

  options = options.map(o => ({
    ...o,
    option_is_distractor: !!o.option_is_distractor
  }))

  questions.forEach(q => {
    const q_options = options.filter(o => o.question_id == q.question_id)
    q.options = q_options
  })

  return questions
}

async function post(question) {
  const result = await db('questions').insert(question)
  return result
}

module.exports = {
  getAll,
  post,
}
