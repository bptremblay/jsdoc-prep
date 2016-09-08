/* eslint-disable no-param-reassign */
const migrations = [{
  fromVersion: '3.0.0',
  toVersion: '3.3.0',
  migrate: (state) => {
    const classTextMappings = {
      about: 'about-text',
      HeadlineText: 'headline-text',
      SectionHeadline: 'section-headline-text',
      preheader: 'preheader-text',
      'article-heading': 'article-heading-text',
      'feature-heading': 'feature-heading-text',
      'display-text': 'display-text'
    };
    state.columns.forEach(column => {
      if (state.name.indexOf('Feature Article') === 0) {
        state.class = 'feature-border';
        column.class = 'feature';
      }
      column.blocks.forEach(block => {
        block.contents.forEach(content => {
          const className = classTextMappings[content.name];
          if (className) {
            content.class = className;
          }
          if (content.name === 'preheader') {
            column.class = 'preheader';
          }
        });
      });
    });
  }
}];
export default migrations;