import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../models/posts';


@Pipe({ name: 'searchpipe' })
export class SearchPipe implements PipeTransform {
  transform(allPosts: Post[],searchTerm: string) {

    if(allPosts === undefined || searchTerm === undefined) return;

    if(searchTerm.trim() == ""){
      return allPosts;
    }
    return allPosts.filter(post => post.description.toLowerCase().includes(searchTerm.toLowerCase()) || post.title.toLowerCase().includes(searchTerm));
  }
}