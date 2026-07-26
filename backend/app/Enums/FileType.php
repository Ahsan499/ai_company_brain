<?php

namespace App\Enums;

enum FileType: string
{
    case Doc = 'doc';
    case Image = 'image';
    case Spreadsheet = 'spreadsheet';
    case Pdf = 'pdf';
    case Code = 'code';
    case Other = 'other';
}
