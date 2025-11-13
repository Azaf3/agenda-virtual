/**
 * Formatar data para padrão brasileiro
 * @param {Date} date - Data a ser formatada
 * @returns {String} - Data formatada (dd/mm/yyyy)
 */
exports.formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatar data e hora para padrão brasileiro
 * @param {Date} date - Data a ser formatada
 * @returns {String} - Data e hora formatada (dd/mm/yyyy às HH:mm)
 */
exports.formatDateTime = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

/**
 * Formatar horário
 * @param {String} time - Horário no formato HH:MM
 * @returns {String} - Horário formatado
 */
exports.formatTime = (time) => {
  return time;
};

/**
 * Converter data para ISO string
 * @param {String} dateString - Data no formato dd/mm/yyyy
 * @returns {Date} - Data em formato ISO
 */
exports.parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

/**
 * Adicionar dias a uma data
 * @param {Date} date - Data base
 * @param {Number} days - Número de dias a adicionar
 * @returns {Date} - Nova data
 */
exports.addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Verificar se a data é hoje
 * @param {Date} date - Data a verificar
 * @returns {Boolean} - True se for hoje
 */
exports.isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

/**
 * Verificar se a data é amanhã
 * @param {Date} date - Data a verificar
 * @returns {Boolean} - True se for amanhã
 */
exports.isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const d = new Date(date);
  
  return (
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Obter dia da semana
 * @param {Date} date - Data
 * @returns {String} - Nome do dia da semana
 */
exports.getDayOfWeek = (date) => {
  const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const d = new Date(date);
  return days[d.getDay()];
};

/**
 * Calcular duração entre dois horários
 * @param {String} startTime - Horário inicial (HH:MM)
 * @param {String} endTime - Horário final (HH:MM)
 * @returns {Number} - Duração em minutos
 */
exports.calculateDuration = (startTime, endTime) => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;
  
  return endInMinutes - startInMinutes;
};
