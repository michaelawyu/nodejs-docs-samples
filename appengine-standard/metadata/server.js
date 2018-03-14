/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START appengine_metadata]
const express = require('express');
const request = require('got');

const app = express();
app.enable('trust proxy');

const METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
'project/project-id';

function getProjectId () {
  const options = {
    headers: {
      'Metadata-Flavor': 'Google'
    },
    json: false
  };

  return request(METADATA_NETWORK_INTERFACE_URL, options)
    .then((response) => response.body)
    .catch((err) => {
      if (err || err.statusCode !== 200) {
        console.log('Error while talking to metadata server.');
        console.log(err)
        return 'An error has occurred';
      }
      return Promise.reject(err);
    });
}

app.get('/', (req, res, next) => {
  getProjectId()
    .then((projectId) => {
      res.status(200).send(`Project ID: ${projectId}`).end();
    })
    .catch(next);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END appengine_metadata]
