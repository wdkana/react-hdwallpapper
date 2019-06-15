import { take, call, fork, put } from 'redux-saga/effects';

import { IMAGES } from '../constants';
import { fetchImageStats } from '../api';
import { loadImageStats, setImageStats, setImageStatsError } from '../actions';

export function* handleStatsRequest(id) {
    for (let i = 0; i < 3; i++) {
        try {
            yield put(loadImageStats(id));
            const res = yield call(fetchImageStats, id);
            yield put(setImageStats(id, res.downloads.total));
            return true;
        } catch (e) {
        }
    }
    yield put(setImageStatsError(id));
}

export default function* watchStatsRequest() {
    while (true) {
        const { images } = yield take(IMAGES.LOAD_SUCCESS);

        for (let i = 0; i < images.length; i++) {
            yield fork(handleStatsRequest, images[i].id);
        }
    }
}
