package com.termplayer

import android.content.Context
import android.provider.MediaStore

/**
 * Queries the Android [MediaStore] for every audio file on external
 * storage and returns them as a sorted list of [Track] objects.
 *
 * Only files with a duration > 0 are included (filters out short
 * notification sounds, etc.).
 */
object MediaScanner {

    fun scan(context: Context): List<Track> {
        val tracks = mutableListOf<Track>()

        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.DATA,
            MediaStore.Audio.Media.DISPLAY_NAME,
        )

        val selection  = "${MediaStore.Audio.Media.IS_MUSIC} != 0"
        val sortOrder  = "${MediaStore.Audio.Media.TITLE} ASC"

        context.contentResolver.query(
            MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
            projection,
            selection,
            null,
            sortOrder
        )?.use { cursor ->

            val idCol     = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
            val titleCol  = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
            val artistCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
            val albumCol  = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
            val durCol    = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
            val dataCol   = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA)
            val nameCol   = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DISPLAY_NAME)

            while (cursor.moveToNext()) {
                val duration = cursor.getLong(durCol)
                if (duration > 0) {
                    tracks.add(
                        Track(
                            id          = cursor.getLong(idCol),
                            title       = cursor.getString(titleCol).orEmpty(),
                            artist      = cursor.getString(artistCol).orEmpty(),
                            album       = cursor.getString(albumCol).orEmpty(),
                            durationMs  = duration,
                            path        = cursor.getString(dataCol).orEmpty(),
                            displayName = cursor.getString(nameCol).orEmpty(),
                        )
                    )
                }
            }
        }

        return tracks
    }
}
