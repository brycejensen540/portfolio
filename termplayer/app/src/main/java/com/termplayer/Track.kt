package com.termplayer

/**
 * Represents a single audio track discovered on the device.
 *
 * @param id         MediaStore row ID
 * @param title      Song title from metadata (may be empty)
 * @param artist     Artist name from metadata (may be empty)
 * @param album      Album name from metadata (may be empty)
 * @param durationMs Track length in milliseconds
 * @param path       Absolute file path on disk
 * @param displayName Filename as shown by the OS
 */
data class Track(
    val id: Long,
    val title: String,
    val artist: String,
    val album: String,
    val durationMs: Long,
    val path: String,
    val displayName: String
) {
    /** Best-effort display name: "Artist – Title", or title, or filename. */
    val displayTitle: String
        get() = when {
            artist.isNotBlank() && title.isNotBlank() -> "$artist – $title"
            title.isNotBlank() -> title
            else -> displayName
        }

    /** Duration formatted as "m:ss". */
    val durationFormatted: String
        get() {
            val totalSec = durationMs / 1000
            val min = totalSec / 60
            val sec = totalSec % 60
            return "%d:%02d".format(min, sec)
        }
}
