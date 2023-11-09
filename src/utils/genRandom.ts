import * as  randomstring from 'randomstring';



export  const genRandomId = (prefix = 'NH', length = 10) => {
    const rand = randomstring.generate({
      length,
      charset: 'alphanumeric',
      capitalization: 'uppercase',
    });
    return `${prefix}-${rand}`;
  };