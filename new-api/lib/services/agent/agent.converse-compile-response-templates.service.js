import _ from 'lodash';

module.exports = function ({ responses, templateContext }) {

    const { handlebars } = this.server.app;

    let parsedResponses = _.map(responses, (response) => {

        const match = response.textResponse.match(/{{/g);
        const numberOfSlots = match ? match.length : 0;
        const compiledResponse = handlebars.compile(response.textResponse, { strict: true });
        try {
            return { textResponse: compiledResponse(templateContext), numberOfSlots, actions: response.actions };
        }
        catch (error) {
            return null;
        }
    });

    parsedResponses = _.compact(parsedResponses);
    if (parsedResponses.length > 0) {

        const maxNumberOfExpressions = _.max(_.map(parsedResponses, 'numberOfSlots'));
        parsedResponses = _.filter(parsedResponses, (parsedResponse) => {

            return parsedResponse.textResponse !== '' && parsedResponse.numberOfSlots === maxNumberOfExpressions;
        });
    }
    
    if (parsedResponses.length > 0 ){
        return parsedResponses[Math.floor(Math.random() * parsedResponses.length)];
    }
    return { textResponse: 'Sorry we’re not sure how to respond.', actions: [] };
};
