from io import BytesIO
import win32clipboard
import win32con
from PIL import Image
import sys

# 将图片复制到剪贴板
def set_clipboard_image(image):
    output = BytesIO()
    image.save(output, format="BMP")
    data = output.getvalue()[14:]
    output.close()

    win32clipboard.OpenClipboard()
    try:
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardData(win32con.CF_DIB, data)
        print("Image copied to clipboard.")
    finally:
        win32clipboard.CloseClipboard()
#image_path = "C:\\Users\\23664\\Desktop\\exp\\HtmlServer\\upload\\image.jpg"
print(sys.argv)
image_path = sys.argv[1].replace("\\\\","\\")+"\\upload\\image.jpg"
image = Image.open(image_path)
set_clipboard_image(image)